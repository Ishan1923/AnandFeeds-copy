"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useSearchParams } from "next/navigation";

export default function FilterBox({ title, type, data, searchParams }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(searchParams[type] ? searchParams[type] : '');

  const pathname = usePathname();

  const addParamAndReload = (currentValue) => {
    console.log(currentValue);
    // Add the previous searchParams to the pathname
    let finalURL = pathname;
    let x = 1;
    Object.keys(searchParams).forEach((param) => {
        if (x == 1) {
            finalURL += `?`;
        }
        else {
            console.log('hi');
            finalURL += `&`;
        }
        if (param === type) {
            if (currentValue === value) {
                finalURL.substring(0, (finalURL.length-2));
            }
            else {
                finalURL += `${param}=${currentValue}`;
            }
        }
        else {
            finalURL += `${param}=${searchParams[param]}`
        }
        x += 1;
    });
    // console.log(pathname);
    // console.log(currentValue);
    if (Object.keys(searchParams).length === 0) {
        if (currentValue !== value) {
            finalURL += `?${type}=${currentValue}`
        }
    }
    else {
        if (currentValue !== value && !searchParams[type]) {
            finalURL += `&${type}=${currentValue}`;
        }
    }

    window.location.href = finalURL;
    console.log(finalURL);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((dataItem) => dataItem.value === value)?.label
            : `Select ${title}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandEmpty>No {type} found.</CommandEmpty>
          <CommandGroup>
            {data.map((dataItem) => (
              <CommandItem
                key={dataItem.value}
                value={dataItem.value}
                onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    addParamAndReload(currentValue);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === dataItem.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {dataItem.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
