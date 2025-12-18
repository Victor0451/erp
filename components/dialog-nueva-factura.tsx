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
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { facturacionSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MyComponentProps {
    traerDatos: () => void;
    facturaToEdit?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function DialogNuevaFactura({ traerDatos, facturaToEdit, open, onOpenChange }: MyComponentProps) {
    const [error, setError] = useState<string | null>(null);
    const [proveedores, saveProveedores] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof facturacionSchema>>({
        resolver: zodResolver(facturacionSchema),
        defaultValues: {
            fecha: new Date(),
            idproveedor: undefined,
            nro_factura: "",
            descripcion: "",
            importe: 0,
            moneda: undefined,
        },
    });

    useEffect(() => {
        if (facturaToEdit) {
            form.reset({
                fecha: new Date(facturaToEdit.fecha),
                idproveedor: Number(facturaToEdit.idproveedor),
                nro_factura: facturaToEdit.nro_factura,
                descripcion: facturaToEdit.descripcion,
                importe: Number(facturaToEdit.importe),
                moneda: facturaToEdit.moneda,
            });
        } else {
            form.reset({
                fecha: new Date(),
                idproveedor: undefined,
                nro_factura: "",
                descripcion: "",
                importe: 0,
                moneda: undefined,
            });
        }
    }, [facturaToEdit, form]);

    const traerProveedores = async () => {
        const getRows = await fetch(`/api/proveedores?f=traer proveedores`);
        const rawText = await getRows.text();
        try {
            const data = JSON.parse(rawText);
            saveProveedores(data);
        } catch (error) {
            console.error("Error parsing JSON:", error, rawText);
        }
    };

    const regDatos = async (values: z.infer<typeof facturacionSchema>) => {
        const postData = {
            fecha: values.fecha,
            idproveedor: values.idproveedor,
            nro_factura: values.nro_factura,
            descripcion: values.descripcion,
            importe: values.importe,
            moneda: values.moneda,
            f: "reg factura",
        };

        try {
            const response = await fetch("/api/facturacion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                showToast.success("Factura Registrada", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al registrar la factura", {
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

    const actDatos = async (values: z.infer<typeof facturacionSchema>) => {
        const postData = {
            fecha: values.fecha,
            idproveedor: values.idproveedor,
            nro_factura: values.nro_factura,
            descripcion: values.descripcion,
            importe: values.importe,
            moneda: values.moneda,
            idfactura: facturaToEdit.idfactura,
            f: "act factura",
        };

        try {
            const response = await fetch("/api/facturacion", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                showToast.success("Factura Actualizada", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al actualizar la factura", {
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

    async function onSubmit(values: z.infer<typeof facturacionSchema>) {
        setError(null);
        startTransition(async () => {
            if (facturaToEdit) {
                await actDatos(values);
            } else {
                await regDatos(values);
            }
        });
    }

    useEffect(() => {
        traerProveedores();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!onOpenChange && (
                <DialogTrigger asChild>
                    <Button variant="outline">Nueva Factura</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[1200px] ">
                <DialogHeader>
                    <DialogTitle>{facturaToEdit ? "Editar Factura" : "Nueva Factura"}</DialogTitle>
                    <DialogDescription>
                        {facturaToEdit ? "Modifica los datos de la factura." : "Ingresa los datos de la nueva factura."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="fecha"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Fecha"
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
                                        name="idproveedor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Proveedor</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        value={field.value ? field.value.toString() : ""}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Proveedor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {proveedores.map((p, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={p.idproveedor.toString()}
                                                                >
                                                                    {p.proveedor.toString()}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="nro_factura"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>N° Factura</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="N° Factura"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="importe"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Importe</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="moneda"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Moneda</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(value)}
                                                        value={field.value || ""}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Moneda" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pesos">Pesos</SelectItem>
                                                            <SelectItem value="Dolares">Dolares</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="descripcion"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descripción</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Descripción"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
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

                                <Button type="submit">{facturaToEdit ? "Actualizar" : "Registrar"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
