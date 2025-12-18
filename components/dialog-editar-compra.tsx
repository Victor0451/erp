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
    compraToEdit: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DialogEditarCompra({
    traerDatos,
    compraToEdit,
    open,
    onOpenChange,
}: MyComponentProps) {
    const [error, setError] = useState<string | null>(null);
    const [impTotal, saveImpTotal] = useState<number>(0);
    const [monedaSel, saveMonedaSel] = useState<string | null>("");
    const [provSel, saveprovSel] = useState<string | null>("");
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [producto, setProducto] = useState<any>(null);

    const cantidadRef = useRef<HTMLInputElement>(null);
    const fechaRef = useRef<HTMLInputElement>(null);
    const observacionRef = useRef<HTMLInputElement>(null);
    const nroFacturaRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            const res = await fetch("/api/proveedores?f=traer proveedores");
            const data = await res.json();
            setProveedores(data);
        };
        fetchProveedores();
    }, []);

    useEffect(() => {
        if (compraToEdit) {
            saveMonedaSel(compraToEdit.moneda);
            saveprovSel(compraToEdit.idproveedor.toString());
            saveImpTotal(compraToEdit.importe);

            // Fetch product details
            const fetchProducto = async () => {
                // We need a way to fetch a single product by ID. 
                // The current API supports 'traer productos' (all) or by category.
                // Let's fetch all and find (inefficient but works for now) or add a new endpoint.
                // Or just use what we have.
                const res = await fetch("/api/productos?f=traer productos");
                const data = await res.json();
                const prod = data.find((p: any) => p.idproducto === compraToEdit.idproducto);
                setProducto(prod);
            };
            fetchProducto();
        }
    }, [compraToEdit]);

    const updateStock = async (diff: number) => {
        if (diff === 0) return;

        let data = {
            f: "act stock",
            idproducto: compraToEdit.idproducto,
            cantidad: diff, // This will be added to stock. If diff is positive (bought more), stock increases.
        };

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
        const viejaCantidad = compraToEdit.cantidad;
        const diff = nuevaCantidad - viejaCantidad;

        const postData = {
            fecha: fechaRef.current?.value,
            idproducto: compraToEdit.idproducto,
            cantidad: nuevaCantidad,
            importe: impTotal,
            idproveedor: provSel,
            moneda: monedaSel,
            nro_factura: nroFacturaRef.current?.value,
            observacion: observacionRef.current?.value,
            idcompra: compraToEdit.idcompra,
            f: "act compra",
        };

        if (postData.moneda === "") {
            setError("Debes seleccionar el tipo de divisa");
        } else if (postData.fecha === "") {
            setError("Debes seleccionar la fecha");
        } else if (postData.cantidad <= 0) {
            setError("La cantidad debe ser mayor a 0");
        } else if (!postData.idproveedor) {
            setError("Debes seleccionar el proveedor");
        } else {
            try {
                const response = await fetch("/api/compras", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                });
                if (response.status === 200) {
                    showToast.success("Compra Actualizada", {
                        duration: 4000,
                        position: "top-right",
                        transition: "fadeIn",
                        sound: true,
                    });
                    traerDatos();
                    updateStock(diff);
                    onOpenChange(false);
                } else {
                    showToast.error("Error al actualizar la compra", { duration: 4000 });
                }
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    };

    if (!compraToEdit) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] ">
                <DialogHeader>
                    <DialogTitle>
                        <u>Editar Compra</u>: {compraToEdit.producto}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Modifica los datos de la compra.
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
                                    placeholder="Fecha de Compra"
                                    type="date"
                                    ref={fechaRef}
                                    defaultValue={compraToEdit.fecha ? new Date(compraToEdit.fecha).toISOString().split('T')[0] : ''}
                                />
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Cantidad</Label>
                                <Input
                                    className="mt-1"
                                    type="number"
                                    onChange={calImporte}
                                    ref={cantidadRef}
                                    defaultValue={compraToEdit.cantidad}
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
                                <Label>Proveedor</Label>
                                <Select onValueChange={saveprovSel} value={provSel || ""}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Proveedores" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {proveedores.map((p: any, index: any) => (
                                            <SelectItem key={index} value={p.idproveedor.toString()}>
                                                {p.proveedor.toString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                                <Label>Nro de Factura</Label>
                                <Input className="mt-1" type="text" ref={nroFacturaRef} defaultValue={compraToEdit.nro_factura} />
                            </div>

                            <div className="w-full md:w-full px-3 mt-6 mb-6 md:mb-0">
                                <Label>Observacion</Label>
                                <Input
                                    className="mt-1"
                                    placeholder="observacion"
                                    type="text"
                                    ref={observacionRef}
                                    defaultValue={compraToEdit.observacion}
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
