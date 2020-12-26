export type TCrudAction = "READ" | "CREATE" | "UPDATE"
| "REPLACE" | "SOFT_DEL" | "DELETE" | "RESTORE";

export type TCrudOptions = {
    exclude?: TCrudAction[];
    only?: TCrudAction[];
}
