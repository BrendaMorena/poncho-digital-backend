import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

// CONSIDERAR PARA MOVER A UTILS
// const verificarAtributoId = async (modelo, atributoId) => {
//   const pabellon = await prisma[modelo].findUnique({
//     where:{id_pabellon: pabellonId} aqui falta ver como pasar el nombre de la col, traerlo como parametro
//   })
// }

const verificarPabellon = async (pabellonId) => {
  const pabellon = await prisma.pabellon.findUnique({
    where:{id_pabellon: pabellonId}
  })
  
  if(!pabellon){
    throw crearError(`No existe un pabellon con id ${pabellonId}`, 400)
  }
}

const verificarSector = async (sectorId) => {
  const sector = await prisma.sector.findUnique({
    where:{id_sector: sectorId}
  })

  if(!sector){
    throw crearError(`No existe un sector con id ${sectorId}`, 400)
  }
}


export const crearStand = async (crearStandDTO) => {
  const { numero_stand, coordenada, pabellonId, sectorId } = crearStandDTO;

  if (pabellonId) {
    await verificarPabellon(pabellonId);
  }
  
  if (sectorId) {
    await verificarSector(sectorId);
  }

  return prisma.stand.create({
    data: {
      numero_stand: numero_stand,
      coordenada: coordenada,
      pabellonId: pabellonId ?? null,
      sectorId: sectorId ?? null,
      estado: "DISPONIBLE",
    },
    include: {
      pabellon: true,
      sector: true,
    }
  });
};

