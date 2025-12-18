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
import { haberesSchema } from "../lib/zod";
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
    haberToEdit?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function DialogNuevoHaber({ traerDatos, haberToEdit, open, onOpenChange }: MyComponentProps) {
    const [error, setError] = useState<string | null>(null);
    const [empleados, saveEmpleados] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof haberesSchema>>({
        resolver: zodResolver(haberesSchema),
        defaultValues: {
            idempleado: undefined,
            fecha_pago: new Date(),
            dias_trabajo: 0,
            cant_unitario: 0,
            haberes: 0,
            antiguedad_porcentaje: 0,
            antiguedad_monto: 0,
            asig_familiar: 0,
            no_remunerado: 0,
            premio: 0,
            haberes_brutos: 0,
            jubilacion_porcentaje: 11,
            jubilacion: 0,
            ley_19032_porcentaje: 3,
            ley_19032: 0,
            obra_social_porcentaje: 3,
            obra_social: 0,
            renatea_porcentaje: 1.5,
            renatea: 0,
            cta_solidaria_porcentaje: 2,
            cta_solidaria: 0,
            total_deducciones: 0,
            haberes_neto: 0,
            anticipo: 0,
            cancelacion: 0,
        },
    });

    useEffect(() => {
        if (haberToEdit) {
            form.reset({
                idempleado: haberToEdit.idempleado,
                fecha_pago: new Date(haberToEdit.fecha_pago),
                dias_trabajo: Number(haberToEdit.dias_trabajo),
                cant_unitario: Number(haberToEdit.cant_unitario),
                haberes: Number(haberToEdit.haberes),
                antiguedad_porcentaje: Number(haberToEdit.antiguedad_porcentaje),
                antiguedad_monto: Number(haberToEdit.antiguedad_monto),
                asig_familiar: Number(haberToEdit.asig_familiar),
                no_remunerado: Number(haberToEdit.no_remunerado),
                premio: Number(haberToEdit.premio),
                haberes_brutos: Number(haberToEdit.haberes_brutos),
                jubilacion_porcentaje: Number(haberToEdit.jubilacion_porcentaje),
                jubilacion: Number(haberToEdit.jubilacion),
                ley_19032_porcentaje: Number(haberToEdit.ley_19032_porcentaje),
                ley_19032: Number(haberToEdit.ley_19032),
                obra_social_porcentaje: Number(haberToEdit.obra_social_porcentaje),
                obra_social: Number(haberToEdit.obra_social),
                renatea_porcentaje: Number(haberToEdit.renatea_porcentaje),
                renatea: Number(haberToEdit.renatea),
                cta_solidaria_porcentaje: Number(haberToEdit.cta_solidaria_porcentaje),
                cta_solidaria: Number(haberToEdit.cta_solidaria),
                total_deducciones: Number(haberToEdit.total_deducciones),
                haberes_neto: Number(haberToEdit.haberes_neto),
                anticipo: Number(haberToEdit.anticipo),
                cancelacion: Number(haberToEdit.cancelacion),
            });
        } else {
            form.reset({
                idempleado: undefined,
                fecha_pago: new Date(),
                dias_trabajo: 0,
                cant_unitario: 0,
                haberes: 0,
                antiguedad_porcentaje: 0,
                antiguedad_monto: 0,
                asig_familiar: 0,
                no_remunerado: 0,
                premio: 0,
                haberes_brutos: 0,
                jubilacion_porcentaje: 11,
                jubilacion: 0,
                ley_19032_porcentaje: 3,
                ley_19032: 0,
                obra_social_porcentaje: 3,
                obra_social: 0,
                renatea_porcentaje: 1.5,
                renatea: 0,
                cta_solidaria_porcentaje: 2,
                cta_solidaria: 0,
                total_deducciones: 0,
                haberes_neto: 0,
                anticipo: 0,
                cancelacion: 0,
            });
        }
    }, [haberToEdit, form]);

    const traerEmpleados = async () => {
        const getRows = await fetch(`/api/empleados?f=traer empleados`);
        const rawText = await getRows.text();
        try {
            const data = JSON.parse(rawText);
            saveEmpleados(data);
        } catch (error) {
            console.error("Error parsing JSON:", error, rawText);
        }
    };

    // Calculations
    const diasTrabajo = form.watch("dias_trabajo");
    const cantUnitario = form.watch("cant_unitario");
    const antiguedadPorcentaje = form.watch("antiguedad_porcentaje");
    const asigFamiliar = form.watch("asig_familiar");
    const noRemunerado = form.watch("no_remunerado");
    const premio = form.watch("premio");
    const anticipo = form.watch("anticipo");
    const jubilacionPorcentaje = form.watch("jubilacion_porcentaje");
    const ley19032Porcentaje = form.watch("ley_19032_porcentaje");
    const obraSocialPorcentaje = form.watch("obra_social_porcentaje");
    const renateaPorcentaje = form.watch("renatea_porcentaje");
    const ctaSolidariaPorcentaje = form.watch("cta_solidaria_porcentaje");

    useEffect(() => {
        const valDiasTrabajo = Number(diasTrabajo) || 0;
        const valCantUnitario = Number(cantUnitario) || 0;
        const valAntiguedadPorcentaje = Number(antiguedadPorcentaje) || 0;
        const valAsigFamiliar = Number(asigFamiliar) || 0;
        const valNoRemunerado = Number(noRemunerado) || 0;
        const valPremio = Number(premio) || 0;
        const valAnticipo = Number(anticipo) || 0;
        const valJubilacionPorcentaje = Number(jubilacionPorcentaje) || 0;
        const valLey19032Porcentaje = Number(ley19032Porcentaje) || 0;
        const valObraSocialPorcentaje = Number(obraSocialPorcentaje) || 0;
        const valRenateaPorcentaje = Number(renateaPorcentaje) || 0;
        const valCtaSolidariaPorcentaje = Number(ctaSolidariaPorcentaje) || 0;

        const haberes = valDiasTrabajo * valCantUnitario;
        form.setValue("haberes", haberes);

        const antiguedadMonto = haberes * (valAntiguedadPorcentaje / 100);
        form.setValue("antiguedad_monto", antiguedadMonto);

        const haberesBrutos = haberes + antiguedadMonto + valAsigFamiliar + valNoRemunerado + valPremio;
        form.setValue("haberes_brutos", haberesBrutos);

        // Deductions - only calculate if haberes_brutos > 0
        const jubilacion = haberesBrutos > 0 ? haberesBrutos * (valJubilacionPorcentaje / 100) : 0;
        form.setValue("jubilacion", jubilacion);

        const ley19032 = haberesBrutos > 0 ? haberesBrutos * (valLey19032Porcentaje / 100) : 0;
        form.setValue("ley_19032", ley19032);

        const obraSocial = haberesBrutos > 0 ? haberesBrutos * (valObraSocialPorcentaje / 100) : 0;
        form.setValue("obra_social", obraSocial);

        const renatea = haberesBrutos > 0 ? haberesBrutos * (valRenateaPorcentaje / 100) : 0;
        form.setValue("renatea", renatea);

        const ctaSolidaria = haberesBrutos > 0 ? haberesBrutos * (valCtaSolidariaPorcentaje / 100) : 0;
        form.setValue("cta_solidaria", ctaSolidaria);

        const totalDeducciones = jubilacion + ley19032 + obraSocial + renatea + ctaSolidaria;
        form.setValue("total_deducciones", totalDeducciones);

        const haberesNeto = haberesBrutos - totalDeducciones;
        form.setValue("haberes_neto", haberesNeto);

        const cancelacion = haberesNeto - valAnticipo;
        form.setValue("cancelacion", cancelacion);

    }, [diasTrabajo, cantUnitario, antiguedadPorcentaje, asigFamiliar, noRemunerado, premio, anticipo, jubilacionPorcentaje, ley19032Porcentaje, obraSocialPorcentaje, renateaPorcentaje, ctaSolidariaPorcentaje, form]);


    const regDatos = async (values: z.infer<typeof haberesSchema>) => {
        try {
            const response = await fetch("/api/haberes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, f: "reg haber" }),
            });

            if (response.status === 200) {
                showToast.success("Haber Registrado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al registrar el haber", {
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

    const actDatos = async (values: z.infer<typeof haberesSchema>) => {
        try {
            const response = await fetch("/api/haberes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, idhaber: haberToEdit.idhaber, f: "act haber" }),
            });

            if (response.status === 200) {
                showToast.success("Haber Actualizado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else if (response.status === 500) {
                showToast.error("Ocurrio un error al actualizar el haber", {
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

    async function onSubmit(values: z.infer<typeof haberesSchema>) {
        setError(null);
        startTransition(async () => {
            if (haberToEdit) {
                await actDatos(values);
            } else {
                await regDatos(values);
            }
        });
    }

    useEffect(() => {
        traerEmpleados();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!onOpenChange && (
                <DialogTrigger asChild>
                    <Button variant="outline">Nuevo Haber</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[1200px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{haberToEdit ? "Editar Liquidación" : "Liquidación de Haberes"}</DialogTitle>
                    <DialogDescription>
                        {haberToEdit ? "Modifica los haberes del empleado." : "Calcula y registra los haberes del empleado."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                {/* Empleado y Fecha */}
                                <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="idempleado"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Empleado</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        value={field.value ? field.value.toString() : ""}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar Empleado" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {empleados.map((e, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={e.idempleado.toString()}
                                                                >
                                                                    {e.apellido}, {e.nombre} - {e.categoria || 'Sin categoría'}
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
                                <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="fecha_pago"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de Pago</FormLabel>
                                                <FormControl>
                                                    <Input
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

                                {/* Inputs for Calculation */}
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="dias_trabajo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Días Trabajados</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="cant_unitario"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Precio Unitario</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="antiguedad_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Antigüedad %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="asig_familiar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Asig. Familiar</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="no_remunerado"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>No Remunerado</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="premio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Premio</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="anticipo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Anticipo</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Deduction Percentages Section */}
                                <div className="w-full border-t my-4"></div>
                                <div className="w-full px-3 mb-2">
                                    <h3 className="text-lg font-semibold">Porcentajes de Deducciones</h3>
                                </div>
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="jubilacion_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jubilación %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="ley_19032_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ley 19032 %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="obra_social_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Obra Social %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="renatea_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Renatea %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                    <FormField
                                        control={form.control}
                                        name="cta_solidaria_porcentaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cta. Solidaria %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Calculated Fields (Read Only) */}
                                <div className="w-full border-t my-4"></div>
                                <div className="w-full px-3 mb-2">
                                    <h3 className="text-lg font-semibold">Resultados Calculados</h3>
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Haberes</FormLabel>
                                    <Input readOnly value={form.watch("haberes")?.toFixed(2)} />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Antigüedad Monto</FormLabel>
                                    <Input readOnly value={form.watch("antiguedad_monto")?.toFixed(2)} />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Haberes Brutos</FormLabel>
                                    <Input readOnly value={form.watch("haberes_brutos")?.toFixed(2)} />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Total Deducciones</FormLabel>
                                    <Input readOnly value={form.watch("total_deducciones")?.toFixed(2)} />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Haberes Neto</FormLabel>
                                    <Input readOnly value={form.watch("haberes_neto")?.toFixed(2)} />
                                </div>
                                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                                    <FormLabel>Cancelación</FormLabel>
                                    <Input readOnly className="font-bold" value={form.watch("cancelacion")?.toFixed(2)} />
                                </div>

                            </div>
                            {error && <FormMessage>{error}</FormMessage>}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>

                                <Button type="submit">{haberToEdit ? "Actualizar" : "Registrar"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
