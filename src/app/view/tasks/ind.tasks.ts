import { Component } from '@angular/core';

@Component({
  templateUrl: './ind.tasks.html'
})

export class Tasks {

  taks : any;

  constructor(){

    this.taks = [];

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

    this.taks.push({
      taskName : "Registrar Maquinaria",
      stateName : "Pendiente",
      processName : "Registrar EIR",
      userOuwner : "Juan Pérez",
      userCreated : "Ana Lopez",
      information : {
        NroEIR : "231232132"
      }
    });

  }

}