import {
  sectorSchema,
  actualizarSectorSchema,
  consultarSectoresSchema,
} from "../../validators/sectores.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarSector = validarSchemaBody(sectorSchema, "crearSectorDTO", "Los datos enviados para el sector son inválidos");
export const validarActualizarSector = validarSchemaBody(actualizarSectorSchema, "actualizarSectorDTO", "Los datos enviados para actualizar el sector son inválidos");
export const validarConsultaSectores = validarSchemaQuery(consultarSectoresSchema, "consultaSectoresDTO", "Los datos enviados para consultar los sectores son inválidos");
