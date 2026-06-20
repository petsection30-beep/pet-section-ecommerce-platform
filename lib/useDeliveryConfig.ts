"use client"

import { useEffect, useState } from "react"
import brand from "@/config/brand.config"
import type { DeliveryConfig } from "@/lib/delivery"

// Client hook: starts with code defaults, then reflects the admin-editable
// delivery values from the DB (via the public /api/settings endpoint).
export function useDeliveryConfig(): DeliveryConfig {
  const [config, setConfig] = useState<DeliveryConfig>({
    deliveryFee:           brand.deliveryFee,
    freeDeliveryEnabled:   brand.freeDeliveryEnabled,
    freeDeliveryThreshold: brand.freeDeliveryThreshold,
  })

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        if (d.settings) setConfig({
          deliveryFee:           d.settings.deliveryFee,
          freeDeliveryEnabled:   d.settings.freeDeliveryEnabled,
          freeDeliveryThreshold: d.settings.freeDeliveryThreshold,
        })
      })
      .catch(() => {})
  }, [])

  return config
}
