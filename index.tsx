/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, LiveServerMessage, Modality, Session} from '@google/genai';
import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {createBlob, decode, decodeAudioData} from './utils';
import './visual-3d';

@customElement('gdm-live-audio')
export class GdmLiveAudio extends LitElement {
  @state() isRecording = false;
  @state() status = '';
  @state() error = '';
  @state() selectedPersona = 'default';

  private personas = [
    {name: 'Default', value: 'default', file: null},
    {name: 'Old TV GPT', value: 'Old_TV_GPT.json', file: 'Old_TV_GPT.json'},
    {
      name: 'WordPlay GPT',
      value: 'WordPlay_GPT.json',
      file: 'WordPlay_GPT.json',
    },
    {
      name: 'Ghost of Gods',
      value: 'Ghost_of_Gods_Final_Form.json',
      file: 'Ghost_of_Gods_Final_Form.json',
    },
    {name: 'Dakini.Ji', value: 'dakini.json', file: 'dakini.json'},
    {
      name: 'Sugar.exe',
      value: 'sugar_exe_ai_character.json',
      file: 'sugar_exe_ai_character.json',
    },
    {
      name: 'P2L Bangla Prompt',
      value: 'P2L_Bangla_Prompt_Architecture.txt',
      file: 'P2L_Bangla_Prompt_Architecture.txt',
    },
    {
      name: 'Bangladesh P2L01 Capsule',
      value: 'Bangladesh_P2L01_GPT_Capsule.json',
      file: 'Bangladesh_P2L01_GPT_Capsule.json',
    },
    {
      name: 'GPT Bangladesh Override',
      value: 'gpt_bangladesh2025_override.txt',
      file: 'gpt_bangladesh2025_override.txt',
    },
    {
      name: 'Bangladesh Legacy Capsule',
      value: 'bangladesh_p2l_2025_capsule_prompt.txt',
      file: 'bangladesh_p2l_2025_capsule_prompt.txt',
    },
    {
      name: 'AbbuGPT',
      value: 'AbbuGPT.json',
      file: 'AbbuGPT.json',
    },
  ];

  private systemPrompt = '';
  private client: GoogleGenAI;
  private session: Session;
  private inputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 16000});
  private outputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 24000});
  @state() inputNode = this.inputAudioContext.createGain();
  @state() outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream: MediaStream;
  private sourceNode: AudioBufferSourceNode;
  private scriptProcessorNode: ScriptProcessorNode;
  private sources = new Set<AudioBufferSourceNode>();

  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      background-image: url('background.jpg');
      background-size: cover;
      background-position: center center;
    }

    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
      color: white;
      font-family: sans-serif;
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 64px;
        height: 64px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      button[disabled] {
        display: none;
      }
    }

    .persona-selector {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .persona-selector label {
      color: white;
      font-family: sans-serif;
      font-size: 14px;
    }

    .persona-selector select {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 8px;
      font-size: 14px;
      cursor: pointer;
      min-width: 200px;
    }

    .persona-selector select:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;

  constructor() {
    super();
    this.initClient();
  }

  private initAudio() {
    this.nextStartTime = this.outputAudioContext.currentTime;
  }

  private async initClient() {
    this.initAudio();

    this.client = new GoogleGenAI({
      apiKey: process.env.API_KEY,
    });

    this.outputNode.connect(this.outputAudioContext.destination);

    this.initSession();
  }

  private async handlePersonaChange(e: Event) {
    this.error = '';
    this.status = 'Changing persona...';
    const selectElement = e.target as HTMLSelectElement;
    this.selectedPersona = selectElement.value;
    const persona = this.personas.find((p) => p.value === this.selectedPersona);

    if (persona && persona.file) {
      try {
        const response = await fetch(persona.file);
        if (!response.ok) {
          throw new Error(`Failed to load persona file: ${response.statusText}`);
        }
        const content = await response.text();
        if (persona.file.endsWith('.json')) {
          const personaJson = JSON.parse(content);
          this.systemPrompt = `You are an AI assistant. Your persona is ${
            personaJson.name || 'defined below'
          }. Strictly follow these rules and adopt this persona for our entire conversation:\n\n${JSON.stringify(
            personaJson,
            null,
            2,
          )}`;
        } else {
          this.systemPrompt = content;
        }
      } catch (error) {
        this.updateError(`Error loading persona: ${(error as Error).message}`);
        this.systemPrompt = '';
      }
    } else {
      this.systemPrompt = '';
    }

    this.reset();
  }

  private async initSession() {
    const model = 'gemini-2.5-flash-preview-native-audio-dialog';
    const config: any = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Orus'}},
        // languageCode: 'en-GB'
      },
    };

    if (this.systemPrompt) {
      config.systemInstruction = this.systemPrompt;
    }

    try {
      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            this.updateStatus(
              this.selectedPersona === 'default'
                ? 'Connected'
                : `Connected as ${
                    this.personas.find((p) => p.value === this.selectedPersona)
                      ?.name
                  }`,
            );
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts[0]?.inlineData;

            if (audio) {
              this.nextStartTime = Math.max(
                this.nextStartTime,
                this.outputAudioContext.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                this.outputAudioContext,
                24000,
                1,
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);
              source.addEventListener('ended', () => {
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime = this.nextStartTime + audioBuffer.duration;
              this.sources.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            this.updateError(e.message);
          },
          onclose: (e: CloseEvent) => {
            this.updateStatus('Connection closed.');
          },
        },
        config: config,
      });
    } catch (e) {
      console.error(e);
      this.updateError((e as Error).message);
    }
  }

  private updateStatus(msg: string) {
    this.status = msg;
    this.error = '';
  }

  private updateError(msg: string) {
    this.error = msg;
    this.status = '';
  }

  private async startRecording() {
    if (this.isRecording) {
      return;
    }

    this.inputAudioContext.resume();

    this.updateStatus('Requesting microphone access...');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.updateStatus('Microphone access granted. Starting capture...');

      this.sourceNode = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream,
      );
      this.sourceNode.connect(this.inputNode);

      const bufferSize = 256;
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(
        bufferSize,
        1,
        1,
      );

      this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        if (!this.isRecording) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        this.session.sendRealtimeInput({media: createBlob(pcmData)});
      };

      this.sourceNode.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      this.isRecording = true;
      this.updateStatus('🔴 Recording...');
    } catch (err) {
      console.error('Error starting recording:', err);
      this.updateError(`Error: ${(err as Error).message}`);
      this.stopRecording();
    }
  }

  private stopRecording() {
    if (!this.isRecording && !this.mediaStream && !this.inputAudioContext)
      return;

    this.updateStatus('Stopping recording...');

    this.isRecording = false;

    if (this.scriptProcessorNode && this.sourceNode && this.inputAudioContext) {
      this.scriptProcessorNode.disconnect();
      this.sourceNode.disconnect();
    }

    this.scriptProcessorNode = null;
    this.sourceNode = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.updateStatus('Recording stopped.');
  }

  private reset() {
    if (this.isRecording) this.stopRecording();
    this.session?.close();
    this.initSession();
    this.updateStatus('Session reset.');
  }

  render() {
    return html`
      <div>
        <div class="persona-selector">
          <label for="persona-select">Choose a Persona:</label>
          <select
            id="persona-select"
            @change=${this.handlePersonaChange}
            .value=${this.selectedPersona}
            ?disabled=${this.isRecording}>
            ${this.personas.map(
              (p) => html`<option value=${p.value}>${p.name}</option>`,
            )}
          </select>
        </div>

        <div class="controls">
          <button
            id="resetButton"
            @click=${this.reset}
            ?disabled=${this.isRecording}
            title="Reset Session">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff">
              <path
                d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          <button
            id="startButton"
            @click=${this.startRecording}
            ?disabled=${this.isRecording}
            title="Start Recording">
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          <button
            id="stopButton"
            @click=${this.stopRecording}
            ?disabled=${!this.isRecording}
            title="Stop Recording">
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="15" width="70" height="70" rx="10" />
            </svg>
          </button>
        </div>

        <div id="status">${this.error || this.status}</div>
        <gdm-live-audio-visuals-3d
          .inputNode=${this.inputNode}
          .outputNode=${this.outputNode}></gdm-live-audio-visuals-3d>
      </div>
    `;
  }
}