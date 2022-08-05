import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { orderStatusChanged } from "../generated/P2PConveyance/P2PConveyance"

export function createorderStatusChangedEvent(
  id: BigInt,
  restaurantName: string,
  customerName: string,
  deliveryAgentName: string,
  hasBeenDelivered: boolean
): orderStatusChanged {
  let orderStatusChangedEvent = changetype<orderStatusChanged>(newMockEvent())

  orderStatusChangedEvent.parameters = new Array()

  orderStatusChangedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "restaurantName",
      ethereum.Value.fromString(restaurantName)
    )
  )
  orderStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "customerName",
      ethereum.Value.fromString(customerName)
    )
  )
  orderStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "deliveryAgentName",
      ethereum.Value.fromString(deliveryAgentName)
    )
  )
  orderStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "hasBeenDelivered",
      ethereum.Value.fromBoolean(hasBeenDelivered)
    )
  )

  return orderStatusChangedEvent
}
