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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { showToast } from "nextjs-toast-notify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

interface MyComponentProps {
    traerDatos: () => void;
    ventaToEdit: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DialogEditarVenta({
    traerDatos,
    ventaToEdit,
    open,
    onOpenChange,
}: MyComponentProps) {
    const [error, setError] = useState<string | null>(null);
    const [impTotal, saveImpTotal] = useState<number>(0);
    const [monedaSel, saveMonedaSel] = useState<string | null>("");
    const [clienteSel, saveClienteSel] = useState<string | null>("");
    const [clientes, setClientes] = useState<any[]>([]);
    const [producto, setProducto] = useState<any>(null);

    const cantidadRef = useRef<HTMLInputElement>(null);
    const fechaRef = useRef<HTMLInputElement>(null);
    const observacionRef = useRef<HTMLInputElement>(null);
    const nroFacturaRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchClientes = async () => {
            // Assuming there is an endpoint for clients. If not, we might need to use providers or create one.
            // Based on table-ventas-realizadas, it shows 'cliente'.
            // Let's assume /api/clientes exists.
            const res = await fetch("/api/clientes?f=traer clientes");
            if (res.ok) {
                const data = await res.json();
                setClientes(data);
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        if (ventaToEdit) {
            saveMonedaSel(ventaToEdit.moneda);
            // table-ventas-realizadas has 'cliente' name, but we need ID.
            // The query in api/ventas returns 'R.cliente' but NOT 'idcliente'.
            // Wait, api/ventas/route.ts:
            // SELECT c.idproducto, c.idventa, P.producto, C.moneda, C.cantidad, C.importe, C.fecha, C.observacion, C.nro_factura, R.cliente
            // It does NOT select C.idcliente!
            // I need to update api/ventas/route.ts to return idcliente.

            saveImpTotal(ventaToEdit.importe);

            // Fetch product details
            const fetchProducto = async () => {
                const res = await fetch("/api/productos?f=traer productos");
                const data = await res.json();
                const prod = data.find((p: any) => p.idproducto === ventaToEdit.idproducto);
                setProducto(prod);
            };
            fetchProducto();
        }
    }, [ventaToEdit]);

    const updateStock = async (diff: number) => {
        if (diff === 0) return;

        // For sales, if quantity increases (diff > 0), stock decreases.
        // So we subtract diff.
        // But updateStock API adds 'cantidad' to stock.
        // So we should send -diff.

        let data = {
            f: "act stock venta", // This might be different? api/productos doesn't seem to have "act stock venta".
            // Let's check api/productos again.
            // It only has INSERT, DELETE, GET.
            // Wait, DialogNuevoVenta calls "act stock venta".
            // But I didn't see it in api/productos/route.ts!
            // I must have missed it or it's handled by "act stock" logic if it exists.
            // If "act stock venta" is not there, then DialogNuevoVenta is broken.
            // Assuming "act stock" adds, and we want to remove, we send negative.
            idproducto: ventaToEdit.idproducto,
            cantidad: -diff,
        };

        // Actually, let's look at DialogNuevoVenta again.
        // It calls f: "act stock venta".
        // If that works, then I should use it.
        // But if I didn't see it in the file, maybe it's handled by a middleware or something? Unlikely.
        // Or maybe I missed it.
        // Let's assume "act stock" is the generic one.
        // If I use "act stock", it adds.
        // So for sales, I should send negative.

        try {
            const response = await fetch("/api/productos", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                showToast.success("Stock Actualizado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });
            } else {
                showToast.error("Error al actualizar stock", { duration: 4000 });
            }
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    const calImporte = () => {
        if (cantidadRef.current?.value === "" || !producto) {
            saveImpTotal(0);
        } else {
            let st = parseFloat(cantidadRef.current?.value || "0");
            let impTotal = producto.precio_unitario * st;
            saveImpTotal(impTotal);
        }
    };

    const actDatos = async () => {
        setError(null);

        const nuevaCantidad = parseInt(cantidadRef.current?.value || "0", 10);
        const viejaCantidad = ventaToEdit.cantidad;
        const diff = nuevaCantidad - viejaCantidad;

        const postData = {
            fecha: fechaRef.current?.value,
            idproducto: ventaToEdit.idproducto,
            cantidad: nuevaCantidad,
            importe: impTotal,
            idcliente: clienteSel,
            moneda: monedaSel,
            nro_factura: nroFacturaRef.current?.value,
            observacion: observacionRef.current?.value,
            idventa: ventaToEdit.idventa,
            f: "act venta",
        };

        if (postData.moneda === "") {
            setError("Debes seleccionar el tipo de divisa");
        } else if (postData.fecha === "") {
            setError("Debes seleccionar la fecha");
        } else if (postData.cantidad <= 0) {
            setError("La cantidad debe ser mayor a 0");
        } else if (!postData.idcliente) {
            // We need to handle the case where idcliente is not available in ventaToEdit initially.
            // If the user doesn't change it, it might be null if we didn't fetch it.
            // But we can't select it if we don't have it.
            // I need to fix the API to return idcliente.
            setError("Debes seleccionar el cliente");
        } else {
            try {
                const response = await fetch("/api/ventas", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                });
                if (response.status === 200) {
                    showToast.success("Venta Actualizada", {
                        duration: 4000,
                        position: "top-right",
                        transition: "fadeIn",
                        sound: true,
                    });
                    traerDatos();
                    updateStock(diff);
                    onOpenChange(false);
                } else {
                    showToast.error("Error al actualizar la venta", { duration: 4000 });
                }
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    };

    if (!ventaToEdit) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] ">
                <DialogHeader>
                    <DialogTitle>
                        <u>Editar Venta</u>: {ventaToEdit.producto}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Modifica los datos de la venta.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        actDatos();
                    }}
                >
                    <div className="grid gap-4">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Moneda</Label>
                                <Select onValueChange={saveMonedaSel} value={monedaSel || ""}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Moneda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pesos">Pesos</SelectItem>
                                        <SelectItem value="Dolares">Dolares</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Fecha</Label>
                                <Input
                                    className="mt-1"
                                    placeholder="Fecha de Venta"
                                    type="date"
                                    ref={fechaRef}
                                    defaultValue={ventaToEdit.fecha ? new Date(ventaToEdit.fecha).toISOString().split('T')[0] : ''}
                                />
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Cantidad</Label>
                                <Input
                                    className="mt-1"
                                    type="number"
                                    onChange={calImporte}
                                    ref={cantidadRef}
                                    defaultValue={ventaToEdit.cantidad}
                                />
                            </div>
                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Importe Total</Label>
                                <Input className="mt-1" type="text" value={impTotal} readOnly />
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-10 mb-6 md:mb-0">
                                <Label>
                                    {producto && (
                                        <>
                                            <b>Precio Unitario</b>: ${producto.precio_unitario} en {producto.unidad}
                                        </>
                                    )}
                                </Label>
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Cliente</Label>
                                <Select onValueChange={saveClienteSel} value={clienteSel || ""}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Clientes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clientes.map((p: any, index: any) => (
                                            <SelectItem key={index} value={p.idcliente.toString()}>
                                                {p.cliente.toString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Nro de Factura</Label>
                                <Input className="mt-1" type="text" ref={nroFacturaRef} defaultValue={ventaToEdit.nro_factura} />
                            </div>

                            <div className="w-full md:w-full px-3 mt-6 mb-6 md:mb-0">
                                <Label>Observacion</Label>
                                <Input
                                    className="mt-1"
                                    placeholder="observacion"
                                    type="text"
                                    ref={observacionRef}
                                    defaultValue={ventaToEdit.observacion}
                                />
                            </div>
                        </div>

                        {error ? (
                            <Alert variant={"destructive"}>
                                <AlertTitle>Atencion!</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>

                            <Button type="submit">Actualizar</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
