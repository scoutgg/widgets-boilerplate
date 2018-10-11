import { Component, Template } from '@scoutgg/widgets'
import { wire } from 'hyperhtml'
import marked from 'marked'
import ua from '../../services/ua-cyrillic-map'

@Component('lms')
@Template(function (html) {
  html `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        background-color: #000;
        color: #fff;
      }
      h1 {
        font-size: 10em;
      }
      h2 {
        font-weight: 500;
      }
      p {
        display: contents;
      }
    </style>
    <h1>${this.card.letter}</h1>
    <h2>
    ${this.state === 'show' ?
        wire()`${this.card.sound} (${ [this.marked(this.card.example)] })`
      : null
    }
    </h2>
  `
})
export default class FlashCards extends HTMLElement {
  connectedCallback() {
    this.next()
    this.state = 'new'
    this.render()
    window.addEventListener('keyup', (e) => {
      if(e.which === 13) {
        this.next()
      }
    })
  }
  next() {
    switch(this.state) {
      case 'new':
        this.state = 'show'
        break;
      default:
        this.state = 'new'
        this.card = ua[Math.floor(Math.random() * ua.length)]
    }
    this.render()
  }
  get cards() {
    return ua
  }
  get marked() {
    return marked
  }
}
