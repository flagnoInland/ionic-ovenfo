export const pConfig_textoColor = [
	{ class : "", name : "" },
	{ class : "text-primary", name : "Primario" },
	{ class : "text-secondary", name : "Secundario" },
	{ class : "text-success", name : "Exitoso" },
	{ class : "text-danger", name : "Peligro" },
	{ class : "text-warning", name : "Alerta" },
	{ class : "text-info", name : "Informativo" },
	{ class : "text-light", name : "Claro" },
	{ class : "text-dark", name : "Negro" },
	{ class : "text-body", name : "Cuerpo" },
	{ class : "text-muted", name : "Mute" }
]

export const pConfig_textoTamano = [
	{ class : "", name : "" },
	{ class : "text-size-15", name : "Tamaño 15" },
	{ class : "text-size-15i", name : "Tamaño 15 Importante" },
	{ class : "text-size-10", name : "Tamaño 10" }
]

export const pConfig_botonColor = [
	{ class : "", name : "" },
	{ class : "btn-primary", name : "Primario" },
	{ class : "btn-secondary", name : "Secundario" },
	{ class : "btn-success", name : "Exitoso" },
	{ class : "btn-danger", name : "Peligro" },
	{ class : "btn-warning", name : "Alerta" },
	{ class : "btn-info", name : "Informativo" },
	{ class : "btn-light", name : "Claro" },
	{ class : "btn-dark", name : "Negro" },
	{ class : "btn-link", name : "Enlace" },
	{ class : "btn-outline-primary", name : "Primario Ligero" },
	{ class : "btn-outline-secondary", name : "Secundario Ligero" },
	{ class : "btn-outline-success", name : "Exitoso Ligero" },
	{ class : "btn-outline-danger", name : "Peligro Ligero" },
	{ class : "btn-outline-warning", name : "Alerta Ligero" },
	{ class : "btn-outline-info", name : "Informativo Ligero" },
	{ class : "btn-outline-light", name : "Claro Ligero" },
	{ class : "btn-outline-dark", name : "Negro Ligero" },
	{ class : "btn-outline-link", name : "Enlace Ligero" }
]

export const listaMover = (arr : any, old_index : number, new_index : number) => {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};

export const claseCol = (fila : any) => {
	var clase = "";
		clase += (fila.width==-1)?'':(fila.width==0?'col ':'col-'+fila.width+" ");
		clase += (fila.widthSM==-1)?'':(fila.widthSM==0?'col ':'col-sm-'+fila.widthSM+" ");
		clase += (fila.widthMD==-1)?'':(fila.widthMD==0?'col ':'col-md-'+fila.widthMD+" ");
		clase += (fila.widthLG==-1)?'':(fila.widthLG==0?'col ':'col-lg-'+fila.widthLG+" ");
		clase += (fila.widthXL==-1)?'':(fila.widthXL==0?'col ':'col-xl-'+fila.widthXL+" ");
	return clase.trim();
}