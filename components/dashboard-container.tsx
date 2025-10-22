"use client";
import React, { useState, useEffect } from "react";
import { Overview } from "@/components/overview";
import { StockAlerts } from "@/components/stock-alerts";
import { RecentSales } from "@/components/recent-sales";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { CreditCard, DollarSign, ShoppingCart } from "lucide-react";
import { set } from "zod";

export interface IAppProps {}

export function DashboardContainer(props: IAppProps) {
  const [estadistica, setEstadistica] = useState<any>(null);
  const [ventasRecientes, setVentasRecientes] = useState<any>(null);
  const [ventasPorMes, setVentasPorMes] = useState<any[] | null>(null);
  const [alertasStock, setAlertasStock] = useState<any[] | null>(null);

  const traerEstadistica = async () => {
    const getRows = await fetch(`/api/informes?f=est%20ventas%20y%20compras`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);
      setEstadistica(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
    }
  };

  const traerUltimasVentas = async () => {
    const getRows = await fetch(`/api/informes?f=ventas%20recientes`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);

      setVentasRecientes(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
    }
  };

  const traerVentasPorMes = async () => {
    const getRows = await fetch(`/api/informes?f=ventas%20por%20mes`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);
      setVentasPorMes(data);
    } catch (error) {
      console.error("Error parsing JSON for monthly sales:", error, rawText);
    }
  };

  const traerAlertasStock = async () => {
    const getRows = await fetch(`/api/informes?f=stock%20alertas`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);
      setAlertasStock(data);
    } catch (error) {
      console.error("Error parsing JSON for stock alerts:", error, rawText);
    }
  };

  const traerData = () => {
    traerEstadistica();
    traerUltimasVentas();
    traerVentasPorMes();
    traerAlertasStock();
  };
  useEffect(() => {
    traerData();
  }, []);

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Panel de Control
      </h2>

      {estadistica ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Ingresos Totales"
              value={`$${estadistica.ingresosTotales.toLocaleString("es-AR")}`}
              description="+20.1% desde el mes pasado"
              icon={DollarSign}
            />
            <StatCard
              title="Ventas"
              value={`+${estadistica.totalVentas}`}
              description="+180.1% desde el mes pasado"
              icon={CreditCard}
            />
            <StatCard
              title="Compras"
              value={`$${estadistica.gastosTotales.toLocaleString("es-AR")}`}
              description="+19% desde el mes pasado"
              icon={ShoppingCart}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Ventas</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={ventasPorMes || []} />
              </CardContent>
            </Card>
            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>
                  Se realizaron {estadistica.totalVentas} ventas este mes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales ventasRecientes={ventasRecientes} />
              </CardContent>
            </Card>
            <StockAlerts stockAlerts={alertasStock} />
          </div>
        </>
      ) : !estadistica ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <Skeleton className="col-span-4 h-[350px]" />
            <Skeleton className="col-span-4 md:col-span-3 h-[350px]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
