// index.html - line 29 | versionate after
// ng build --prod --configuration=qatms
// node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --prod --configuration=qatms
// node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --prod --configuration=qatms --index=src/environments/qatms/index.html
export const environment = {
  env: "qatms", // Use un body
  production: true,
  protocol: "https",
  hostLocal: "containerservices.inlandservices.com/qatms/inlandnet/",
  host: "containerservices.inlandservices.com", // localhost:8090
  rest: "/apmapiqatms",
  service : "Business",
  host_local_port : "http://10.10.10.51:9996",
  firebase: {
    apiKey: "AIzaSyAAslAmdCGEL53Pqo58LzzhO7_h6NHu6Tw",
    authDomain: "apm-inland-dev.firebaseapp.com",
    databaseURL: "https://apm-inland-dev.firebaseio.com",
    projectId: "apm-inland-dev",
    storageBucket: "apm-inland-dev.appspot.com",
    messagingSenderId: "1097249006965",
    appId: "1:1097249006965:web:d0faca4a312bd38e"
  },
  firebase_coleccion_base : "APM_QA"
};