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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download } from "lucide-react";
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
import { DialgoNuevoProveedor } from "./dialog-nuevo-proveedores";
import { showToast } from "nextjs-toast-notify";
import moment from "moment";
import { exportToExcel } from "@/lib/export-to-excel";

export function TablaProveedores() {
  type Vehiculo = {
    idproveedor: number;
    proveedor: string;
    clave_tributaria: string;
    tipo_clave: string;
    telefono: number;
    domicilio: string;
    observacion: string;
    estado: boolean;
  };

  const [data, saveData] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState<any | null>(null);

  const handleEdit = (proveedor: any) => {
    setProveedorToEdit(proveedor);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setProveedorToEdit(null);
    setIsDialogOpen(true);
  };

  const traerDatos = async () => {
    const getRows = await fetch(`/api/proveedores?f=traer%20proveedores`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);
      saveData(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
    }
  };

  const eliminarDatos = async (id: number) => {
    const deleteRows = await fetch(
      `/api/proveedores?f=eliminar%20proveedor&id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      if (deleteRows.status === 200) {
        showToast.success("vehiculo Eliminado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
      } else if (deleteRows.status === 500) {
        showToast.error("Ocurrio un error al registrar el vehiculo", {
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

  const columns: ColumnDef<Vehiculo>[] = [
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
      accessorKey: "idproveedor",
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
        <div className="lowercase">{row.getValue("idproveedor")}</div>
      ),
    },
    {
      accessorKey: "proveedor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Proveedor
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("proveedor")}</div>
      ),
    },

    {
      accessorKey: "clave_tributaria",
      header: "Clave Tributaria",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("clave_tributaria")}</div>
      ),
    },
    {
      accessorKey: "tipo_clave",
      header: "Tipo Clave",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tipo_clave")}</div>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Telefono",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("telefono")}</div>
      ),
    },
    {
      accessorKey: "domicilio",
      header: "Domicilio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("domicilio")}</div>
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
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <>
          {row.original.estado === true ? (
            <div className="capitalize">Activo</div>
          ) : row.original.estado === false ? (
            <div className="capitalize">De Baja</div>
          ) : null}
        </>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const proveedor = row.original;

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
              <DropdownMenuItem
                onClick={() => eliminarDatos(proveedor.idproveedor)}
              >
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(proveedor)}>
                Editar
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
  }, []);

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

  const handleExportToExcel = () => {
    const visibleColumns = table.getAllColumns()
      .filter(col => col.getIsVisible() && col.id !== 'select' && col.id !== 'actions')
      .map(col => ({
        header: typeof col.columnDef.header === 'string'
          ? col.columnDef.header
          : col.id,
        accessor: col.id,
        formatter: (value: any) => {
          if (col.id === 'estado') {
            return value === true ? 'Activo' : 'De Baja';
          }
          return value;
        }
      }));

    exportToExcel({
      filename: 'proveedores',
      columns: visibleColumns,
      data: table.getFilteredRowModel().rows.map(row => row.original)
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por proveedor..."
          value={
            (table.getColumn("proveedor")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("proveedor")?.setFilterValue(event.target.value)
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

        <Button variant="outline" onClick={handleExportToExcel} className="mr-2">
          <Download className="mr-2 h-4 w-4" />
          Exportar a Excel
        </Button>

        <Button onClick={handleNew}>Nuevo Proveedor</Button>
        <DialgoNuevoProveedor
          traerDatos={traerDatos}
          proveedorToEdit={proveedorToEdit}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
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
    </div >
  );
}
