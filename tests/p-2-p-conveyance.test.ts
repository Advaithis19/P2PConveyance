import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { orderStatusChanged } from "../generated/schema"
import { orderStatusChanged as orderStatusChangedEvent } from "../generated/P2PConveyance/P2PConveyance"
import { handleorderStatusChanged } from "../src/p-2-p-conveyance"
import { createorderStatusChangedEvent } from "./p-2-p-conveyance-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let restaurantName = "Example string value"
    let customerName = "Example string value"
    let deliveryAgentName = "Example string value"
    let hasBeenDelivered = "boolean Not implemented"
    let neworderStatusChangedEvent = createorderStatusChangedEvent(
      id,
      restaurantName,
      customerName,
      deliveryAgentName,
      hasBeenDelivered
    )
    handleorderStatusChanged(neworderStatusChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("orderStatusChanged created and stored", () => {
    assert.entityCount("orderStatusChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "orderStatusChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "restaurantName",
      "Example string value"
    )
    assert.fieldEquals(
      "orderStatusChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "customerName",
      "Example string value"
    )
    assert.fieldEquals(
      "orderStatusChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "deliveryAgentName",
      "Example string value"
    )
    assert.fieldEquals(
      "orderStatusChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hasBeenDelivered",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
