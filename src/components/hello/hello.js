import { Component, Template, Attribute } from '@scoutgg/widgets'


@Component('demo')
@Attribute('name', String)
@Template(function (html) {
  html `
    <h1>Hello ${this.name}</h1>
  `
})
export default class Hello extends HTMLElement {
}
