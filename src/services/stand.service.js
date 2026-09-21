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
    where: { id_pabellon: pabellonId },
  });

  if (!pabellon) {
    throw crearError(`No existe un pabellon con id ${pabellonId}`, 400);
  }
};

const verificarSector = async (sectorId) => {
  const sector = await prisma.sector.findUnique({
    where: { id_sector: sectorId },
  });

  if (!sector) {
    throw crearError(`No existe un sector con id ${sectorId}`, 400);
  }
};

export const obtenerStands = async () => {
  return await prisma.stand.findMany({
    include: {
      pabellon: true,
      sector: true,
      artesano: true,
    },
  });
};

export const obtenerStandPorId = async (standId) =>{
  return await prisma.stand.findUnique({
    where: {
      id_stand: standId
    }, 
    include: {
      pabellon: true, 
      sector: true,
      artesano: true,
    }
  })
  
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
    },
  });
};

export const actualizarStand = async (idStand, actualizarStandDTO) => {

  // Clonamos el DTO para manipularlo de forma segura
  const data = {...actualizarStandDTO}

  if (data.pabellonId) {
    await verificarPabellon(data.pabellonId);
  }

  if (data.sectorId) {
    await verificarSector(data.sectorId);
  }

  // Regla de negocio: si el stand se libera o entra en mantenimiento, desvinculamos el artesano
  if (data.estado === "DISPONIBLE" || data.estado === "MANTENIMIENTO") {
    data.artesanoId = null;
  }

  return prisma.stand.update({
      where: { id_stand: idStand },
      data: data,
      include: {
        pabellon: true,
        sector: true,
        artesano: true,
      }
    }
  )
};
