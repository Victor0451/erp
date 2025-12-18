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
import { DialogNuevoEmpleado } from "./dialog-nuevo-empleado";
import { showToast } from "nextjs-toast-notify";
import moment from "moment";
import { exportToExcel } from "@/lib/export-to-excel";

export function TablaEmpleados() {
    type Empleado = {
        idempleado: number;
        cuil: string;
        dni: string;
        apellido: string;
        nombre: string;
        fecha_ingreso: Date;
        categoria: string;
        idcategoria: number;
        estado: boolean;
    };

    const [data, saveData] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [empleadoToEdit, setEmpleadoToEdit] = useState<Empleado | null>(null);

    const handleEdit = (empleado: Empleado) => {
        setEmpleadoToEdit(empleado);
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setEmpleadoToEdit(null);
        setIsDialogOpen(true);
    };

    const traerDatos = async () => {
        const getRows = await fetch(`/api/empleados?f=traer%20empleados`);
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
            `/api/empleados?f=eliminar%20empleado&id=${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        try {
            if (deleteRows.status === 200) {
                showToast.success("Empleado Eliminado", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
            } else if (deleteRows.status === 500) {
                showToast.error("Ocurrio un error al eliminar el empleado", {
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

    const columns: ColumnDef<Empleado>[] = [
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
            accessorKey: "apellido",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Apellido
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("apellido")}</div>
            ),
        },
        {
            accessorKey: "nombre",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("nombre")}</div>
            ),
        },
        {
            accessorKey: "dni",
            header: "DNI",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("dni")}</div>
            ),
        },
        {
            accessorKey: "cuil",
            header: "CUIL",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("cuil")}</div>
            ),
        },
        {
            accessorKey: "fecha_ingreso",
            header: "Fecha Ingreso",
            cell: ({ row }) => (
                <div className="capitalize">
                    {moment(row.getValue("fecha_ingreso")).utcOffset("+100").format("DD/MM/YYYY")}
                </div>
            ),
        },
        {
            accessorKey: "categoria",
            header: "Categoría",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("categoria")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const empleado = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => eliminarDatos(empleado.idempleado)}
                            >
                                Eliminar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(empleado)}>
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
                    if (col.id === 'fecha_ingreso') {
                        return moment(value).format('DD/MM/YYYY');
                    }
                    return value;
                }
            }));

        exportToExcel({
            filename: 'empleados',
            columns: visibleColumns,
            data: table.getFilteredRowModel().rows.map(row => row.original)
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-4">
                <Input
                    placeholder="Filtrar por apellido..."
                    value={
                        (table.getColumn("apellido")?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table.getColumn("apellido")?.setFilterValue(event.target.value)
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

                <Button variant="outline" onClick={handleExportToExcel}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar a Excel
                </Button>

                <Button onClick={handleNew}>Nuevo Empleado</Button>
                <DialogNuevoEmpleado
                    traerDatos={traerDatos}
                    empleadoToEdit={empleadoToEdit}
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
        </div>
    );
}
