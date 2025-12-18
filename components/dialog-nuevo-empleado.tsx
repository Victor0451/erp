import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { empleadoSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";

interface MyComponentProps {
    traerDatos: () => void;
    empleadoToEdit?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function DialogNuevoEmpleado({ traerDatos, empleadoToEdit, open, onOpenChange }: MyComponentProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [categorias, setCategorias] = useState<any[]>([]);

    const form = useForm<z.infer<typeof empleadoSchema>>({
        resolver: zodResolver(empleadoSchema),
        defaultValues: {
            cuil: "",
            dni: "",
            apellido: "",
            nombre: "",
            fecha_ingreso: new Date(),
            idcategoria: undefined,
        },
    });

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const response = await fetch("/api/categorias?f=traer empleados_categorias");
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                }
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        cargarCategorias();
    }, []);

    useEffect(() => {
        if (empleadoToEdit) {
            form.reset({
                cuil: empleadoToEdit.cuil,
                dni: empleadoToEdit.dni,
                apellido: empleadoToEdit.apellido,
                nombre: empleadoToEdit.nombre,
                fecha_ingreso: new Date(empleadoToEdit.fecha_ingreso),
                idcategoria: empleadoToEdit.idcategoria,
            });
        } else {
            form.reset({
                cuil: "",
                dni: "",
                apellido: "",
                nombre: "",
                fecha_ingreso: new Date(),
                idcategoria: undefined,
            });
        }
    }, [empleadoToEdit, form]);

    const regDatos = async (values: z.infer<typeof empleadoSchema>) => {
        const postData = {
            cuil: values.cuil,
            dni: values.dni,
            apellido: values.apellido,
            nombre: values.nombre,
            fecha_ingreso: values.fecha_ingreso,
            idcategoria: values.idcategoria,
            f: "reg empleado",
        };

        try {
            const response = await fetch("/api/empleados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                showToast.success("Empleado Registrado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al registrar el empleado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const actDatos = async (values: z.infer<typeof empleadoSchema>) => {
        const postData = {
            cuil: values.cuil,
            dni: values.dni,
            apellido: values.apellido,
            nombre: values.nombre,
            fecha_ingreso: values.fecha_ingreso,
            idcategoria: values.idcategoria,
            idempleado: empleadoToEdit.idempleado,
            f: "act empleado",
        };

        try {
            const response = await fetch("/api/empleados", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                showToast.success("Empleado Actualizado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al actualizar el empleado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    async function onSubmit(values: z.infer<typeof empleadoSchema>) {
        setError(null);
        startTransition(async () => {
            if (empleadoToEdit) {
                await actDatos(values);
            } else {
                await regDatos(values);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!onOpenChange && (
                <DialogTrigger asChild>
                    <Button variant="outline">Nuevo Empleado</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[1200px] ">
                <DialogHeader>
                    <DialogTitle>{empleadoToEdit ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
                    <DialogDescription>
                        {empleadoToEdit ? "Modifica los datos del empleado." : "Ingresa los datos del nuevo empleado."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="cuil"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CUIL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="CUIL"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="dni"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DNI</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="DNI"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="apellido"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Apellido</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Apellido"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="nombre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nombre"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="fecha_ingreso"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de Ingreso</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Fecha de Ingreso"
                                                        type="date"
                                                        {...field}
                                                        value={
                                                            field.value instanceof Date
                                                                ? field.value.toISOString().split("T")[0]
                                                                : field.value
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="idcategoria"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categoría</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una categoría" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categorias.map((categoria) => (
                                                            <SelectItem
                                                                key={categoria.idcategoria}
                                                                value={categoria.idcategoria.toString()}
                                                            >
                                                                {categoria.categoria}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            {error && <FormMessage>{error}</FormMessage>}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>

                                <Button type="submit">{empleadoToEdit ? "Actualizar" : "Registrar"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
