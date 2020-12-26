export type TCrudAction = "Read-All" | "Create-One" | "Update-One"
| "Replace-One" | "Delete-One" | "RESTORE";

export type TCrudOptions = {
    exclude?: TCrudAction[];
    only?: TCrudAction[];
}
