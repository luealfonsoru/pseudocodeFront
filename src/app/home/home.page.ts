import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  terminal = '>:'
  debug
  disableNextLevel = true
  levels = [
    {
      title: "Crea una variable",
      description: 'Escribe "Sea \'x\'. y selecciona Ejecutar Código ',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          if (response.response.vars["'x'"] && !response.response.error) {
            this.terminal += " ¡Felicitaciones! pasas al siguiente nivel :D \n >:"
            this.disableNextLevel = false
            console.log("yes")
          } else if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          } else if (response.response.error) {
            this.terminal += ` Error Semántico: ${response.response.error}  \n >:`
          } else {
            this.terminal += " Error: no has declarado la variable 'x' \n >:"
          }
        } else {
          if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          } else if (response.response.error) {
            this.terminal += " Error Semántico: verifica tu programa \n >:"
          }
        }
      }
    },
    {
      title: "Asigna un valor a la variable",
      description: 'Asígnale a x el valor de 1 escribiendo "Sea \'x\' igual al número 1." y luego selecciona Ejecutar Código. ',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          if (response.response.vars["'x'"] && response.response.vars["'x'"].value === 1 && !response.response.error) {
            this.terminal += " ¡Felicitaciones! pasas al siguiente nivel :D \n >:"
            this.disableNextLevel = false
            console.log("yes")
          } else if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          } else if (response.response.error) {
            this.terminal += ` Error Semántico: ${response.response.error}  \n >:`
          } else {
            this.terminal += " Error: no has declarado la variable 'x' o no le has asignado un valor\n >:"
          }
        } else {
          if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          }
          if (response.response.error) {
            this.terminal += " Error Semántico: verifica tu programa \n >:"
          }
        }
      }
    }
  ]
  currentLevel = 1
  constructor(public connection: ConnectionService) { }
  nextLevel() {
    this.currentLevel += 1
    this.terminal = ">:"
    this.disableNextLevel = true
  }
  async sendCode(form) {
    console.log(form.value)
    let response = await this.connection.sendCode(this.cleanCode(form.value))
    console.log(response)
    this.levels[this.currentLevel - 1].winning(response)
  }

  cleanCode(code) {
    let sendCode = code.code.replace(/\n/g, ' ')
    sendCode += ' '
    return { code: sendCode };
  }
  ngOnInit() {
    this.currentLevel = 1
  }

}
