"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { showToast } from "nextjs-toast-notify";
import moment from "moment";

export function TablaVentasRealizadas({
  onVentaEliminada,
  refresh,
}: {
  onVentaEliminada: () => void;
  refresh?: boolean;
}) {
  type Venta = {
    fecha: Date;
    idventa: number;
    cantidad: number;
    importe: number;
    idproveedor: number;
    moneda: string;
    nro_factura: string;
    observacion: string;
  };

  const [data, saveData] = useState<any[]>([]);

  const traerDatos = async () => {
    const getRows = await fetch(`/api/ventas?f=traer%20ventas`);
    const rawText = await getRows.text();

    try {
      const data = JSON.parse(rawText);

      saveData(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
    }
  };

  const eliminarDatos = async (venta: any) => {
    const deleteRows = await fetch(
      `/api/ventas?f=eliminar%20venta&id=${venta.idventa}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      if (deleteRows.status === 200) {
        showToast.success("Venta Eliminada", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        updateStock(venta);
        onVentaEliminada();
      } else if (deleteRows.status === 500) {
        showToast.error("Ocurrio un error al eliminar la venta", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const updateStock = async (prod: any) => {
    let data = {
      f: "act stock del venta",
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
  const columns: ColumnDef<Venta>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "idventa",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("idventa")}</div>
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha Venta",
      cell: ({ row }) => (
        <div className="capitalize">
          {moment(row.getValue("fecha")).utcOffset("+100").format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "producto",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Producto
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("producto")}</div>
      ),
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("cliente")}</div>
      ),
    },
    {
      accessorKey: "moneda",
      header: "Moneda",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("moneda")}</div>
      ),
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("cantidad")}</div>
      ),
    },
    {
      accessorKey: "importe",
      header: "Importe",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("importe")}</div>
      ),
    },
    {
      accessorKey: "nro_factura",
      header: "N° Factura",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nro_factura")}</div>
      ),
    },
    {
      accessorKey: "observacion",
      header: "Observacion",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("observacion")}</div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const venta = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => eliminarDatos(venta)}>
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    traerDatos();
  }, [refresh]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por producto..."
          value={
            (table.getColumn("producto")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("producto")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
