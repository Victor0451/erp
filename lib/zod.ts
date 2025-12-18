import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ required_error: "El email es requerido." })
    .email("Email inválido."),
  password: z.string({ required_error: "La contraseña es requerida." })
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .max(32, "La contraseña no puede tener más de 32 caracteres."),
});

export const registerSchema = z.object({
  email: z.string({ required_error: "El email es requerido." })
    .email("Email inválido."),
  password: z.string({ required_error: "La contraseña es requerida." })
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .max(32, "La contraseña no puede tener más de 32 caracteres."),
  name: z.string({ required_error: "El nombre es requerido." })
    .min(1, "El nombre es requerido.")
    .max(32, "El nombre no puede tener más de 32 caracteres."),
});

export const categoriaSchema = z.object({
  categoria: z.string({ required_error: "El nombre de la categoría es requerido." })
    .min(1, "El nombre de la categoría es requerido."),
  descripcion: z.string().optional(),
});

export const productoSchema = z.object({
  producto: z.string({ required_error: "El nombre del producto es requerido." })
    .min(1, "El nombre del producto es requerido."),
  alta: z.coerce.date({
    required_error: "Ingresa la fecha de alta del producto",
    invalid_type_error: "La fecha de alta no es válida.",
  }),
  moneda: z.enum(["Pesos", "Dolares"], {
    required_error: "Selecciona una moneda.",
  }),
  unidad: z.enum(["kg", "lts", "unidades", "cajas", "metros", "paquetes"], {
    required_error: "Selecciona una unidad de medida.",
  }),
  stock: z.coerce.number({
    required_error: "El stock es requerido.",
    invalid_type_error: "El stock debe ser un número.",
  }).int("El stock debe ser un número entero.").nonnegative("El stock no puede ser negativo."),
  idcategoria: z.coerce.number({
    required_error: "La categoría es requerida.",
    invalid_type_error: "La categoría debe ser un número.",
  }).int("La categoría debe ser un número entero.").positive("La categoría debe ser un ID válido."),
  observacion: z.string().optional(),
  precio_unitario: z.coerce.number({
    required_error: "El precio unitario es requerido.",
    invalid_type_error: "El precio unitario debe ser un número.",
  }).nonnegative("El precio unitario no puede ser negativo."),
});

export const vehiculoSchema = z.object({
  vehiculo: z.string({ required_error: "El nombre del vehículo es requerido." })
    .min(1, "El nombre del vehículo es requerido."),
  patente: z.string({ required_error: "La patente del vehículo es requerida." })
    .min(1, "La patente del vehículo es requerida."),
  modelo: z.coerce.number({
    required_error: "El modelo (año) es requerido.",
    invalid_type_error: "El modelo debe ser un número.",
  }).int().positive("El modelo debe ser un año válido."),
  observacion: z.string().optional(),
});

export const proveedorSchema = z.object({
  proveedor: z.string({ required_error: "El nombre del proveedor es requerido." })
    .min(1, "El nombre del proveedor es requerido."),
  clave_tributaria: z.string({ required_error: "La clave tributaria es requerida." })
    .min(1, "La clave tributaria es requerida."),
  tipo_clave: z.enum(["CUIT", "CUIL"], {
    required_error: "Selecciona un tipo de clave.",
  }),
  telefono: z.coerce.number({
    required_error: "El teléfono es requerido.",
    invalid_type_error: "El teléfono debe ser un número.",
  }).positive("El teléfono debe ser un número válido."),
  domicilio: z.string({ required_error: "El domicilio es requerido." })
    .min(1, "El domicilio es requerido."),
  observacion: z.string().optional(),
});

export const compraSchema = z.object({
  fecha: z.coerce.date({
    required_error: "La fecha de la compra es requerida.",
    invalid_type_error: "La fecha no es válida.",
  }),
  idproducto: z.coerce.number().int().positive("Producto inválido."),
  cantidad: z.coerce.number({ required_error: "La cantidad es requerida." })
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor a cero."),
  importe: z.coerce.number({ required_error: "El importe es requerido." })
    .nonnegative("El importe no puede ser negativo."),
  idproveedor: z.coerce.number().int().positive("Proveedor inválido."),
  moneda: z.enum(["Pesos", "Dolares"], { required_error: "La moneda es requerida." }),
  nro_factura: z.string({ required_error: "El número de factura es requerido." }),
  observacion: z.string().optional(),
});

export const tenantSchema = z.object({
  empresa: z.string().min(1, "El nombre de la empresa es requerido."),
  razon_social: z.string().min(1, "La razón social es requerida."),
  cuit_cuil: z.string().min(1, "El CUIT/CUIL es requerido."),
  direccion: z.string().min(1, "La dirección es requerida."),
  telefono: z.coerce.number().positive("El teléfono debe ser un número válido."),
  email: z.string().email("Email inválido."),
  ubicacion: z.string().min(1, "La ubicación es requerida."),
});

export const facturacionSchema = z.object({
  fecha: z.coerce.date({
    required_error: "La fecha es requerida.",
    invalid_type_error: "La fecha no es válida.",
  }),
  idproveedor: z.coerce.number().int().positive("Proveedor inválido."),
  nro_factura: z.string({ required_error: "El número de factura es requerido." }),
  descripcion: z.string().optional(),
  importe: z.coerce.number({ required_error: "El importe es requerido." })
    .nonnegative("El importe no puede ser negativo."),
  moneda: z.enum(["Pesos", "Dolares"], { required_error: "La moneda es requerida." }),
});

export const empleadoSchema = z.object({
  cuil: z.string().min(1, "El CUIL es requerido."),
  dni: z.string().min(1, "El DNI es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  nombre: z.string().min(1, "El nombre es requerido."),
  fecha_ingreso: z.coerce.date({
    required_error: "La fecha de ingreso es requerida.",
    invalid_type_error: "La fecha no es válida.",
  }),
  idcategoria: z.coerce.number({
    required_error: "La categoría es requerida.",
    invalid_type_error: "La categoría debe ser un número.",
  }).int("La categoría debe ser un número entero.").positive("La categoría debe ser un ID válido."),
});

export const haberesSchema = z.object({
  idempleado: z.coerce.number().int().positive("Empleado inválido."),
  fecha_pago: z.coerce.date({
    required_error: "La fecha de pago es requerida.",
    invalid_type_error: "La fecha no es válida.",
  }),
  dias_trabajo: z.coerce.number().int().nonnegative("Días de trabajo inválidos."),
  cant_unitario: z.coerce.number().nonnegative("Cantidad unitaria inválida."),
  haberes: z.coerce.number().nonnegative(),
  antiguedad_porcentaje: z.coerce.number().nonnegative(),
  antiguedad_monto: z.coerce.number().nonnegative(),
  asig_familiar: z.coerce.number().nonnegative(),
  no_remunerado: z.coerce.number().nonnegative(),
  premio: z.coerce.number().nonnegative(),
  haberes_brutos: z.coerce.number().nonnegative(),
  jubilacion_porcentaje: z.coerce.number().nonnegative().optional(),
  jubilacion: z.coerce.number().nonnegative(),
  ley_19032_porcentaje: z.coerce.number().nonnegative().optional(),
  ley_19032: z.coerce.number().nonnegative(),
  obra_social_porcentaje: z.coerce.number().nonnegative().optional(),
  obra_social: z.coerce.number().nonnegative(),
  renatea_porcentaje: z.coerce.number().nonnegative().optional(),
  renatea: z.coerce.number().nonnegative(),
  cta_solidaria_porcentaje: z.coerce.number().nonnegative().optional(),
  cta_solidaria: z.coerce.number().nonnegative(),
  total_deducciones: z.coerce.number().nonnegative(),
  haberes_neto: z.coerce.number(),
  anticipo: z.coerce.number().nonnegative(),
  cancelacion: z.coerce.number(),
});
