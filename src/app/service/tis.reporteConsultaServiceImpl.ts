import { ReporteConsultaServiceJPO } from "./tis.reporteConsultaService";

export class ReporteConsultaServiceJPOImpl extends ReporteConsultaServiceJPO {

    consultarReporte(fields : any, body : any, call ?: { (resp : any) }){
        this.jpo.get("consultarReporte",{
            fields : fields,
            body : body,
            response : (rs) => {
                if(call){
                    call(rs);
                }
            },
            showLoader : true
        });
    }

}