"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function AdditemButton() {

    const router = useRouter();


    return (
        <Button
            onClick={() =>
                router.push("/items/create")
            }
            className="
        flex
        items-center
        gap-2
      "
        >
            <Plus className="h-4 w-4" />

            Add item

        </Button>
    );
}