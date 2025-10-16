import { date, object, string, number, boolean } from "zod";

export const loginSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("email Invalido"),
  password: string({ required_error: "Password es requerido" })
    .min(1, "Password es requerido")
    .min(6, "Password tiene que ser mayor 6 caracteres")
    .max(32, "Password tiene que ser menor 32 caracteres"),
});

export const registerSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("email Invalido"),
  password: string({ required_error: "Password es requerido" })
    .min(1, "Password es requerido")
    .min(6, "Password tiene que ser mayor 6 caracteres")
    .max(32, "Password tiene que ser menor 32 caracteres"),
  name: string({ required_error: "Name es requerido" })
    .min(1, "Name es requerido")
    .max(32, "Name tiene que ser menor 32 caracteres"),
});

export const categoriaSchema = object({
  categoria: string({
    required_error: "Ingresa el nombre de la categoria",
  }).min(1, "Categoria es requerida"),

  descripcion: string().optional(),
});

export const productoSchema = object({
  producto: string({
    required_error: "Ingresa el nombre del producto",
  }).min(1, "Producto es requerido"),
  alta: date({
    required_error: "Ingresa la fecha de alta del producto",
  }),
  unidad: string(),
  stock: string().transform((v) => Number(v) || 0),
  idcategoria: string().transform((v) => Number(v) || 0),
  observacion: string().optional(),
  precio_unitario: string().transform((v) => Number(v) || 0),
});

export const vehiculoSchema = object({
  vehiculo: string({
    required_error: "Ingresa el nombre del vehiculo",
  }).min(1, "Vehiculo es requerido"),
  patente: string({
    required_error: "Ingresa la patente del vehiculo",
  }).min(1, "Patente es requerido"),
  modelo: string().transform((v) => Number(v) || 0),
  observacion: string().optional(),
});

export const proveedorSchema = object({
  proveedor: string({
    required_error: "Ingresa el nombre del proveedor",
  }).min(1, "Proveedor es requerido"),
  clave_tributaria: string({
    required_error: "Ingresa la clave tributaria (CUIL/CUIT)",
  }).min(1, "Patente es requerido"),
  tipo_clave: string(),
  telefono: string().transform((v) => Number(v) || 0),
  domicilio: string(),
  observacion: string().optional(),
});

export const compraSchema = object({
  fecha: date({
    required_error: "Ingresa la fecha de alta del producto",
  }),
  idproducto: string().transform((v) => Number(v) || 0),
  cantidad: string().transform((v) => Number(v) || 0),
  importe: string().transform((v) => Number(v) || 0),
  idproveedor: number(),
  moneda: string(),
  nro_factura: string(),
  observacion: string().optional(),
});
