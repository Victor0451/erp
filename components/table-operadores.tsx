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
import {
  DropdownMenu,
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
import { DialogoNuevoOperador } from "./dialog-nuevo-operador";
import { exportToExcel } from "@/lib/export-to-excel";

export type Operador = {
  id: string;
  name: string;
  email: string;
  role: string;
  estado: boolean | null;
};

export function TablaOperadores() {
  const [data, saveData] = useState<Operador[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [operadorToEdit, setOperadorToEdit] = useState<Operador | null>(null);

  const handleEdit = (operador: Operador) => {
    setOperadorToEdit(operador);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setOperadorToEdit(null);
    setIsDialogOpen(true);
  };

  const traerDatos = async () => {
    const getRows = await fetch(`/api/operadores?f=traer%20operadores`);
    if (getRows.ok) {
      const data = await getRows.json();
      saveData(data);
    } else {
      console.error("Error al traer los operadores");
      saveData([]);
    }
  };

  const eliminarDatos = async (id: string) => {
    const deleteRows = await fetch(`/api/operadores?id=${id}`, {
      method: "DELETE",
    });

    if (deleteRows.ok) {
      showToast.success("Operador Eliminado");
      traerDatos();
    } else {
      const errorData = await deleteRows.json();
      showToast.error(
        errorData.error || "Ocurrió un error al eliminar el operador"
      );
    }
  };

  const columns: ColumnDef<Operador>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.estado === true ? (
            <div className="capitalize">Activo</div>
          ) : row.original.estado === false ? (
            <div className="capitalize">De Baja</div>
          ) : null}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const operador = row.original;

        // No mostrar acciones para el rol de ADMIN
        if (operador.role === "admin") {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => eliminarDatos(operador.id)}
              >
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(operador)}>
                Editar
              </DropdownMenuItem>
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
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
      filename: 'operadores',
      columns: visibleColumns,
      data: table.getFilteredRowModel().rows.map(row => row.original)
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" onClick={handleExportToExcel} className="mr-2">
          <Download className="mr-2 h-4 w-4" />
          Exportar a Excel
        </Button>

        <Button onClick={handleNew}>Nuevo Operador</Button>
        <DialogoNuevoOperador
          traerDatos={traerDatos}
          operadorToEdit={operadorToEdit}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
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
                  No se encontraron operadores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
