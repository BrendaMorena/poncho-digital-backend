import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";


export const obtenerRubros = async () => {
 
 return await prisma.rubro.findMany({
    orderBy: { nombre: 'asc' } 

})
}

export const obtenerRubroPorId = async (id) => {
  return await prisma.rubro.findUnique({
    where: {id_rubro: id}

  })
}

export const crearRubro = async (crearRubroDTO) => {
  const { nombre, descripcion } = crearRubroDTO
  return await prisma.rubro.create({
    data: {
      nombre: nombre.trim(),
      descripcion: descripcion.trim()
    }
  })
};

export const actualizarRubro = async (id, actualizarRubroDTO) => {
  const rubro =await prisma.rubro.findUnique({
    where: { id_rubro:id }
    })
    if (!rubro) throw crearError("Rubro no encontrado", 404);
    const { nombre, descripcion } = actualizarRubroDTO;
    return await prisma.rubro.update({
      where: { id_rubro: id },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion.trim()
      }
    })
};

