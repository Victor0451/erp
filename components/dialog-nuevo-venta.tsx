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
  onVentaAgregada: () => void;
  prodSel: any;
  prov: any;
}

export function DialgoNuevaVenta({
  traerDatos,
  prodSel,
  prov,
  onVentaAgregada,
}: MyComponentProps) {
  let idPordRef = useRef<HTMLInputElement>(null);
  let cantidadRef = useRef<HTMLInputElement>(null);
  let monedaRef = useRef<HTMLButtonElement>(null);
  let proveedorRef = useRef<HTMLButtonElement>(null);
  let fechaRef = useRef<HTMLInputElement>(null);
  let observacionRef = useRef<HTMLInputElement>(null);
  let nroFacturaRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [impTotal, saveImpTotal] = useState<number>(0);
  const [monedaSel, saveMonedaSel] = useState<string | null>("");
  const [provSel, saveprovSel] = useState<string | null>("");

  const updateStock = async (prod: any) => {
    let data = {
      f: "act stock venta",
      idproducto: prod.idproducto,
      cantidad: prod.cantidad,
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

        traerDatos();
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al actualizar el stock", {
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

  const calImporte = (pu: any) => {
    if (cantidadRef.current?.value === "") {
      saveImpTotal(0);
    } else {
      let st: any;
      st = cantidadRef.current?.value;

      let impTotal = pu * parseFloat(st);

      saveImpTotal(impTotal);
    }
  };

  const regDatos = async () => {
    setError(null);

    const postData = {
      fecha: fechaRef.current?.value,
      idproducto: idPordRef.current?.value,
      cantidad: cantidadRef.current?.value,
      importe: impTotal,
      idproveedor: provSel,
      moneda: monedaSel,
      nro_factura: nroFacturaRef.current?.value,
      observacion: observacionRef.current?.value,
      f: "reg venta",
    };

    if (postData.moneda === "") {
      setError(
        "Debes seleccionar el tipo de divisa con la que se efectua la compra"
      );
    } else if (postData.fecha === "") {
      setError("Debes seleccionar la fecha de la compra");
    } else if (postData.cantidad === "") {
      setError("Debes ingresar la cantidad de unidades de esta compra");
    } else if (postData.idproveedor === "") {
      setError("Debes seleccionar el proveedor al cual se realizo la compra");
    } else if (postData.nro_factura === "") {
      setError(
        "Debes ingresar el numero de factura de la compra, en caso de no tener ingresa 0"
      );
    } else {
      try {
        const response = await fetch("/api/ventas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        if (response.status === 200) {
          showToast.success("Venta Registrada", {
            duration: 4000,
            position: "top-right",
            transition: "fadeIn",
            sound: true,
          });
          traerDatos();
          updateStock(postData);
          onVentaAgregada();
        } else if (response.status === 500) {
          showToast.error("Ocurrio un error al registrar la venta", {
            duration: 4000,
            position: "top-right",
            transition: "fadeIn",
            sound: true,
          });
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nueva Venta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] ">
        <DialogHeader>
          <DialogTitle>
            <u>Nueva Venta</u>: {prodSel.producto}
          </DialogTitle>
          <DialogDescription className="mt-1">
            Ingresa los datos de la nueva venta.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            regDatos();
          }}
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                <Label>Moneda</Label>
                <Select onValueChange={saveMonedaSel}>
                  <SelectTrigger className="mt-1" ref={monedaRef}>
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
                />
              </div>

              <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                <Label>Cantidad</Label>
                <Input
                  className="mt-1"
                  type="number"
                  onChange={() => calImporte(prodSel.precio_unitario)}
                  ref={cantidadRef}
                />
              </div>
              <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                <Label>Importe Total</Label>
                <Input className="mt-1" type="text" value={impTotal} readOnly />
              </div>

              <div className="w-full md:w-1/5 px-3 mt-10 mb-6 md:mb-0">
                <Label>
                  <b>Este producto tiene un Precio Unitario de</b>: $
                  {prodSel.precio_unitario} en {prodSel.unidad}
                </Label>
              </div>

              <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                <Label>Proveedor</Label>
                <Select onValueChange={saveprovSel}>
                  <SelectTrigger className="mt-1" ref={proveedorRef}>
                    <SelectValue placeholder="Proveedores" />
                  </SelectTrigger>
                  <SelectContent>
                    {prov.map((p: any, index: any) => (
                      <SelectItem key={index} value={p.idproveedor.toString()}>
                        {p.proveedor.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                <Label>Nro de Factura</Label>
                <Input className="mt-1" type="text" ref={nroFacturaRef} />
              </div>

              <div className="w-full md:w-full px-3 mt-6 mb-6 md:mb-0">
                <Label>Observacion</Label>
                <Input
                  className="mt-1"
                  placeholder="observacion"
                  type="text"
                  ref={observacionRef}
                />
              </div>

              <Input
                type="hidden"
                defaultValue={prodSel.idproducto}
                ref={idPordRef}
              />
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

              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
