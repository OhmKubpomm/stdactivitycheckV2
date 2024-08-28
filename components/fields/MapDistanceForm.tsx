/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  address: z.string().min(1, "กรุณาใส่ที่อยู่"),
  radius: z.number().min(1, "ระบุระยะทางในเมตร"),
});

type FormValues = z.infer<typeof schema>;

const MapDistanceForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
      radius: 5000, // Default radius in meters
    },
  });
  const [position, setPosition] = useState<[number, number]>([
    13.7563, 100.5018,
  ]); // Default: Bangkok
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial user location fetch or manual location input
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        toast({
          title: "Error",
          description: "ไม่สามารถเข้าถึงตำแหน่งของคุณได้",
        });
      }
    );
  }, [toast]);

  const findNearbyLocations = async (values: FormValues) => {
    try {
      const response = await fetch("/api/findNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLocation: {
            lat: position[0],
            lng: position[1],
          },
          maxDistanceInMeters: values.radius,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
        });
      } else {
        setNearbyLocations(data.nearbyLocations);
        toast({
          title: "Success",
          description: `พบ ${data.nearbyLocations.length} ตำแหน่งในระยะ ${values.radius} เมตร`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "มีบางอย่างผิดปกติ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    findNearbyLocations(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกที่อยู่" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ระยะทาง (เมตร)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="ระบุระยะทางในเมตร"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">ค้นหาตำแหน่งใกล้เคียง</Button>

        <ul>
          {nearbyLocations.map((location, index) => (
            <li key={index}>{location.MapAddress}</li>
          ))}
        </ul>
      </form>
    </Form>
  );
};

export default MapDistanceForm;
