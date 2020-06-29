import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  code = ""
  terminal = '>:'
  debug
  disableNextLevel = true
  winLevel(){
    this.terminal += " ¡Felicitaciones! pasas al siguiente nivel :D \n >:"
    this.disableNextLevel = false
    this.code = ""
  }
  levels = [
    {
      title: "Crea una variable",
      description: 'Escribe "Sea \'x\'." y selecciona Ejecutar Código ',
      hint: 'Así como en el español, el punto al final de la sentencia es importante.',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          if (response.response.vars["'x'"] && !response.response.error) {
            this.winLevel();
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
      hint: '¡Respeta los espacios! No necesitas más ni menos. Si el corrector ortográfico muestra errores: tu código podría estar mal.',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          if (response.response.vars["'x'"] && response.response.vars["'x'"].value === 1 && !response.response.error) {
            this.winLevel()
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
    },
    {
      title: "Haz que tu programa 'Hable'",
      description: 'Crea una variable y asígnale un valor numérico; luego muestralo en el terminal usando "Imprimir \'MiVariable\'." ',
      hint: 'Al escribir varias sentencias, sepáralas usando ".". Si es más comodo: cada sentencia puede ir en una línea aparte ;)',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          if (response.response.printStream.length > 0) {
            this.winLevel()
          } else if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          } else if (response.response.error) {
            this.terminal += ` Error Semántico: ${response.response.error}  \n >:`
          } else {
            this.terminal += " Error: no has imprimido tu variable\n >:"
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
    },
    {
      title: "Suma números",
      description: 'Crea una variable sin valor, luego crea dos variables y asígnales valores numéricos; sumalos y asígnalos a la primera usando "Haga que \'primera\' sea igual al número \'segunda\' más \'tercera\'."',
      hint: '"Sea" y "haga" son distintos: la primera define una variable y la segunda cambia su valor',
      winning: (response) => {
        console.log(response)
        if (response.response.vars) {
          this.debug = response.response.vars
          console.log(Object.keys(response.response.vars).length)
          if (Object.keys(response.response.vars).length === 3) {
            this.winLevel()
          } else if (response.response.error === 1) {
            this.terminal += " Error Sintáctico: verifica la sintaxis de tu programa \n >:"
          } else if (response.response.error) {
            this.terminal += ` Error Semántico: ${response.response.error}  \n >:`
          } else {
            this.terminal += " Error: no has imprimido tu variable\n >:"
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
    let response:any = await this.connection.sendCode(this.cleanCode(form.value))
    if(response.response.printStream && response.response.printStream.length > 0){
      response.response.printStream.forEach(element=>{
        this.terminal += ` ${element.value? element.value: "Indefinido"}  \n >:`
      })
    }
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
