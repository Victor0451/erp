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
import { DialogNuevaFactura } from "./dialog-nueva-factura";
import { showToast } from "nextjs-toast-notify";
import moment from "moment";
import { exportToExcel } from "@/lib/export-to-excel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TablaFacturacion() {
    type Factura = {
        idfactura: number;
        fecha: Date;
        idproveedor: number;
        nro_factura: string;
        descripcion: string;
        importe: number;
        moneda: string;
        anio: number;
    };

    const [data, saveData] = useState<any[]>([]);
    const [anioSel, setAnioSel] = useState<string>("");
    const [proveedores, saveProveedores] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [facturaToEdit, setFacturaToEdit] = useState<Factura | null>(null);

    const handleEdit = (factura: Factura) => {
        setFacturaToEdit(factura);
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setFacturaToEdit(null);
        setIsDialogOpen(true);
    };

    const traerDatos = async () => {
        const getRows = await fetch(`/api/facturacion?f=traer%20facturas%20anio&anio=${anioSel}`);
        const rawText = await getRows.text();
        try {
            const data = JSON.parse(rawText);
            saveData(data);
        } catch (error) {
            console.error("Error parsing JSON:", error, rawText);
        }

        // Also fetch providers to map IDs to names if needed, or just show ID for now. 
        // Ideally we would join in the backend or map here. Let's map here.
        const getRows2 = await fetch(`/api/proveedores?f=traer%20proveedores`);
        const rawText2 = await getRows2.text();
        try {
            const data2 = JSON.parse(rawText2);
            saveProveedores(data2);
        } catch (error) {
            console.error("Error parsing JSON:", error, rawText2);
        }
    };

    const eliminarDatos = async (id: number) => {
        const deleteRows = await fetch(
            `/api/facturacion?f=eliminar%20factura&id=${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        try {
            if (deleteRows.status === 200) {
                showToast.success("Factura Eliminada", {
                    duration: 4000,
                    position: "top-right",
                    transition: "fadeIn",
                    sound: true,
                });

                traerDatos();
            } else if (deleteRows.status === 500) {
                showToast.error("Ocurrio un error al eliminar la factura", {
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

    const getProveedorName = (id: number) => {
        const p = proveedores.find((p: any) => p.idproveedor === id);
        return p ? p.proveedor : id;
    };

    const columns: ColumnDef<Factura>[] = [
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
            accessorKey: "fecha",
            header: "Fecha",
            cell: ({ row }) => (
                <div className="capitalize">
                    {moment(row.getValue("fecha")).utcOffset("+100").format("DD/MM/YYYY")}
                </div>
            ),
        },
        {
            accessorKey: "idproveedor",
            header: "Proveedor",
            cell: ({ row }) => (
                <div className="capitalize">{getProveedorName(row.getValue("idproveedor"))}</div>
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
            accessorKey: "descripcion",
            header: "Descripción",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("descripcion")}</div>
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
            accessorKey: "moneda",
            header: "Moneda",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("moneda")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const factura = row.original;

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
                                onClick={() => eliminarDatos(factura.idfactura)}
                            >
                                Eliminar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(factura)}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Initialize year on client side only to avoid hydration mismatch
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setAnioSel(currentYear.toString());
        setYears(Array.from({ length: 10 }, (_, i) => currentYear - i));
    }, []);

    useEffect(() => {
        if (anioSel) {
            traerDatos();
        }
    }, [anioSel]); // Reload when year changes

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
                    if (col.id === 'fecha') {
                        return moment(value).format('DD/MM/YYYY');
                    }
                    if (col.id === 'idproveedor') {
                        return getProveedorName(value);
                    }
                    return value;
                }
            }));

        exportToExcel({
            filename: 'facturacion',
            columns: visibleColumns,
            data: table.getFilteredRowModel().rows.map(row => row.original)
        });
    };



    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-4">
                <Input
                    placeholder="Filtrar por descripción..."
                    value={
                        (table.getColumn("descripcion")?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table.getColumn("descripcion")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Select
                    onValueChange={(value) => setAnioSel(value)}
                    value={anioSel}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar Año" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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

                <Button onClick={handleNew}>Nueva Factura</Button>
                <DialogNuevaFactura
                    traerDatos={traerDatos}
                    facturaToEdit={facturaToEdit}
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
