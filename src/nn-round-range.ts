import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('nn-round-range')
export class NNRoundRange extends LitElement {
  @property({ type: Number }) value: number = 0;
  @state() isManupulating: boolean = false;
  @state() rectCenter?: { x: number; y: number };
  @query('#container') container?: HTMLElement;
  @query('#circle') circle?: SVGElement;

  protected radian = -(Math.PI / 2); // (Math.PI / 180) * -90

  protected onKeydown(e: KeyboardEvent) {
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      this.value += 1;
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      this.value -= 1;
    }
  }

  protected onStartManupulate(e: MouseEvent) {
    e.preventDefault();
    const rect = this.container!.getBoundingClientRect();
    this.rectCenter = {
      x: rect.right - rect.width / 2,
      y: rect.bottom - rect.height / 2,
    };
    this.isManupulating = true;
  }

  protected onStartManupulateCover(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  protected onManupulating(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    if (!this.isManupulating) return;

    const mousePosition = {
      x:
        ((e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX) -
        this.rectCenter!.x,
      y:
        ((e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY) -
        this.rectCenter!.y,
    };
    this.value =
      (((Math.atan2(
        mousePosition.y * Math.cos(this.radian) - mousePosition.x,
        mousePosition.x * Math.cos(this.radian) + mousePosition.y
      ) *
        180) /
        Math.PI +
        180) *
        100) /
      360;

    this.dispatchEvent(new Event('change'));
  }

  protected onManulupateend(e: MouseEvent) {
    e.preventDefault();
    this.isManupulating = false;
  }

  updated(props: Map<string, any>) {
    if (props.has('value')) {
      this.circle!.style.strokeDasharray = `${Number(this.value) * 10.05} 1005`;
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: inline-flex;
          position: relative;
          width: 240px;
          height: 240px;
          stroke-width: 4px;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .svg {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotateZ(-90deg);
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .cover {
          position: absolute;
          top: 32px;
          left: 32px;
          right: 32px;
          bottom: 32px;
          margin: auto;
          border-radius: 50%;
        }
      </style>
      <div
        id="container"
        class="container"
        @keydown=${this.onKeydown}
        @mousedown=${this.onStartManupulate}
        @mousemove=${this.onManupulating}
        @mouseup=${this.onManulupateend}
        @touchstart=${this.onStartManupulate}
        @touchmove=${this.onManupulating}
        @touchend=${this.onManulupateend}
        tanindex="0"
      >
        <svg class="svg" id="svg" class="circle" viewbox="0 0 320 320">
          <circle
            class="circle-background"
            cx="160"
            cy="160"
            r="158"
            stroke="#dddddd"
            fill="transparent"
          />
          <circle
            id="circle"
            class="circle"
            cx="160"
            cy="160"
            r="158"
            stroke="#07b9f5"
            stroke-dasharray="0 1005"
            fill="transparent"
          />
        </svg>
        <div class="cover" @mousedown=${this.onStartManupulateCover}></div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nn-round-range': NNRoundRange;
  }
}
