import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

interface DialogDetalleHaberProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    haber: any;
}

export function DialogDetalleHaber({ open, onOpenChange, haber }: DialogDetalleHaberProps) {
    if (!haber) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalle de Liquidación</DialogTitle>
                    <DialogDescription>
                        Detalles del haber seleccionado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        {/* Empleado y Fecha */}
                        <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Empleado</Label>
                            <Input readOnly value={`${haber.apellido}, ${haber.nombre}`} />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Fecha de Pago</Label>
                            <Input readOnly value={moment(haber.fecha_pago).utcOffset("+100").format("DD/MM/YYYY")} />
                        </div>

                        {/* Calculation Details */}
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Días Trabajados</Label>
                            <Input readOnly value={haber.dias_trabajo} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Precio Unitario</Label>
                            <Input readOnly value={haber.cant_unitario} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Antigüedad %</Label>
                            <Input readOnly value={haber.antiguedad_porcentaje} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Asig. Familiar</Label>
                            <Input readOnly value={haber.asig_familiar} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>No Remunerado</Label>
                            <Input readOnly value={haber.no_remunerado} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Premio</Label>
                            <Input readOnly value={haber.premio} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Anticipo</Label>
                            <Input readOnly value={haber.anticipo} />
                        </div>

                        {/* Totals */}
                        <div className="w-full border-t my-4"></div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Haberes</Label>
                            <Input readOnly value={Number(haber.haberes).toFixed(2)} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Antigüedad Monto</Label>
                            <Input readOnly value={Number(haber.antiguedad_monto).toFixed(2)} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Haberes Brutos</Label>
                            <Input readOnly value={Number(haber.haberes_brutos).toFixed(2)} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Total Deducciones</Label>
                            <Input readOnly value={Number(haber.total_deducciones).toFixed(2)} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Haberes Neto</Label>
                            <Input readOnly value={Number(haber.haberes_neto).toFixed(2)} />
                        </div>
                        <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                            <Label>Cancelación</Label>
                            <Input readOnly className="font-bold" value={Number(haber.cancelacion).toFixed(2)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
