"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FileText, DollarSign } from "lucide-react";

interface BillingSummaryItem {
    anio: number;
    moneda: string;
    cantidad_facturas: number;
    total_importe: number;
}

interface BillingSummaryProps {
    data: BillingSummaryItem[] | null;
}

export function BillingSummary({ data }: BillingSummaryProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Resumen de Facturación</CardTitle>
                    <CardDescription>
                        No hay datos de facturación disponibles
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Agrupar datos por año
    const dataByYear = data.reduce((acc, item) => {
        if (!acc[item.anio]) {
            acc[item.anio] = [];
        }
        acc[item.anio].push(item);
        return acc;
    }, {} as Record<number, BillingSummaryItem[]>);


    // Ordenar años de forma descendente
    const years = Object.keys(dataByYear)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Resumen de Facturación</CardTitle>
                <CardDescription>
                    Facturas emitidas por año y tipo de moneda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {years.map((year) => {
                        const yearData = dataByYear[year];

                        // Buscar por moneda: "Dolares" y "Pesos"
                        const usdData = yearData.find((item) =>
                            item.moneda?.trim().toLowerCase() === "dolares"
                        );
                        const arsData = yearData.find((item) =>
                            item.moneda?.trim().toLowerCase() === "pesos"
                        );

                        return (
                            <div key={year} className="border-b pb-4 last:border-b-0">
                                <h3 className="text-lg font-semibold mb-3">{year}</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* USD / Dolares */}
                                    {usdData && (
                                        <div className="flex-1 flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                    USD (Dólares)
                                                </p>
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                        <p className="text-xs text-green-700 dark:text-green-300">
                                                            {usdData.cantidad_facturas} factura
                                                            {usdData.cantidad_facturas !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                                                        ${usdData.total_importe.toLocaleString("es-AR", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ARS / Pesos */}
                                    {arsData && (
                                        <div className="flex-1 flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                                                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    ARS (Pesos)
                                                </p>
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                                            {arsData.cantidad_facturas} factura
                                                            {arsData.cantidad_facturas !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                                        ${arsData.total_importe.toLocaleString("es-AR", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
