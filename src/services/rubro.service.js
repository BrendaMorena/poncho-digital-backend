import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";


export const obtenerRubros = async () => {
 
 return await prisma.rubro.findMany({
    orderBy: { nombre: 'asc' } 

})
}

export const obtenerRubrosPorId = async (id) => {
  return await prisma.rubro.findUnique({
    where: {id_rubro: id}

  })
}

export const crearRubro = asynct (crearRubroDTO) => {
  
}