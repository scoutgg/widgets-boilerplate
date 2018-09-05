import { Component, Template, Attribute } from '@scoutgg/widgets'

@Component('demo')
@Attribute('name', String)
@Attribute('count', Number)
@Template(function (html) {
  html `
    <h1>Count ${this.count}</h1>
    <button onclick=${this.increment.bind(this)}>+</button>
    <button onclick=${this.decrement.bind(this)}>-</button>
  `
})
export default class Counter extends HTMLElement {
  connectedCallback() {
    this.count = 0
  }
  increment() {
    this.count++
  }
  decrement() {
    this.count--
  }
}
