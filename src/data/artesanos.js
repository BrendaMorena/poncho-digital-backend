export const artesanos = [
  { id: 1, nombre: 'Juan Perez', rubro: 'Textil', localidad: 'Belén' },
  { id: 2, nombre: 'Maria Gomez', rubro: 'Cerámica', localidad: 'Capital' },
  { id: 3, nombre: 'Carlos López', rubro: 'Madera', localidad: 'Santa Rosa' },
  { id: 4, nombre: 'Ana Torres', rubro: 'Joyería', localidad: 'Banda de Varela' },
  { id: 5, nombre: 'Lucía Fernández', rubro: 'Pintura', localidad: 'Tinogasta' }

];

export const siguienteId = (artesanos) => artesanos.length > 0 ? Math.max(...artesanos.map(e => e.id)) + 1 : 1;
