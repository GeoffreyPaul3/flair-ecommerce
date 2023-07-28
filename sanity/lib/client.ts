import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId, useCdn } from "../env"

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token:
    "skxMceTkLsIpOrmZfDXgr19r3jiHwi72MgJgskqZHL5iIf8ktBViFbPikTZSUlBST5LVDoDLE0nx46STV9XgC2KSANybTIuPvhETAVbt6TaNEmapRLlzU6XaysoRIXGErB3C9Ssh5d0ID5KBuBuEOWKAeKBcDKs87RiRXFvP3T6n65NBDvOK",
})
