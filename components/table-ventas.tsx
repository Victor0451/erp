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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialgoNuevaVenta } from "./dialog-nuevo-venta";

export function TablaVentas({
  onVentaAgregada,
  refresh,
}: {
  onVentaAgregada: () => void;
  refresh?: boolean;
}) {
  type Producto = {
    idproducto: number;
    producto: string;
    alta: Date;
    unidad: string;
    stock: number;
    precio_unitario: number;
    observacion: string;
    estado: boolean;
  };

  const [data, saveData] = useState<any[]>([]);
  const [categorias, saveCategorias] = useState<any[]>([]);
  const [prov, saveProv] = useState<any[]>([]);

  const traerProductos = async (idcategoria?: number) => {
    let url = `/api/productos?f=traer%20productos`;
    if (idcategoria && idcategoria > 0) {
      url = `/api/productos?f=traer%20productos%20categoria&id=${idcategoria}`;
    }
    const getRows = await fetch(url);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);
      saveData(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
      saveData([]); // Limpiar datos en caso de error
    }
  };

  const columns: ColumnDef<Producto>[] = [
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
      accessorKey: "idproducto",
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
        <div className="lowercase">{row.getValue("idproducto")}</div>
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
      accessorKey: "alta",
      header: "Fecha Alta",
      cell: ({ row }) => (
        <div className="capitalize">
          {moment(row.getValue("alta")).utcOffset("+100").format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "unidad",
      header: "Moneda",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("unidad")}</div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("stock")}</div>
      ),
    },
    {
      accessorKey: "precio_unitario",
      header: "Precio Unitario",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("precio_unitario")}</div>
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
        const producto = row.original;

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
              <DialgoNuevaVenta
                traerDatos={() => traerProductos(form.getValues("cateSel"))}
                onVentaAgregada={onVentaAgregada}
                prodSel={producto}
                prov={prov}
              />
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const FormSchema = z.object({
    // For a single-select field
    cateSel: z
      .string({ required_error: "Please select a fruit." })
      .transform((v) => Number(v) || 0),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cateSel: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    traerProductos(values.cateSel);
  }

  useEffect(() => {
    // Llama a traerProductos, respetando el filtro de categoría actual.
    const currentCategory = form.getValues("cateSel");
    traerProductos(currentCategory);
  }, [refresh]);

  useEffect(() => {
    // Cargar datos iniciales y datos que no cambian (categorías, proveedores)
    const fetchInitialData = async () => {
      traerProductos(); // Carga todos los productos al inicio

      const catResponse = await fetch(`/api/categorias?f=traer%20categorias`);
      const catData = await catResponse.json();
      saveCategorias(catData);

      const provResponse = await fetch(`/api/clientes?f=traer%20clientes`);
      const provData = await provResponse.json();
      saveProv(provData);
    };

    fetchInitialData();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

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
      <div className=" border-2 rounded-xl p-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Opciones
        </h4>

        <div className="row">
          <Form {...form}>
            <form
              className="flex flex-wrap -mx-3 mb-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="w-full md:w-1/3 px-3 mt-6 mb-6 md:mb-0">
                <FormField
                  control={form.control}
                  name="cateSel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selecciona una categoria para traer sus productos
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((c, index) => (
                            <SelectItem
                              key={index}
                              value={c.idcategoria.toString()}
                            >
                              {c.categoria.toString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                <Button className="mt-8" type="submit">
                  Buscar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

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

        <Button onClick={() => traerProductos()}>Todos los Productos</Button>
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
