import { useContext, useEffect, useRef } from "react";

import type { RpcTransport } from "@zmkfirmware/zmk-studio-ts-client/transport/index";
import type { AvailableDevice } from "./tauri/index";
import { LockStateContext } from "./rpc/LockStateContext";
import { LockState } from "@zmkfirmware/zmk-studio-ts-client/core";
import { ConnectionContext } from "./rpc/ConnectionContext";

export type TransportFactory = {
  label: string;
  connect?: () => Promise<RpcTransport>;
  pick_and_connect?: {
    list: () => Promise<Array<AvailableDevice>>;
    connect: (dev: AvailableDevice) => Promise<RpcTransport>;
  };
};

export interface UnlockModalProps {}

export const UnlockModal = ({}: UnlockModalProps) => {
  const dialog = useRef<HTMLDialogElement | null>(null);

  let conn = useContext(ConnectionContext);
  let lockState = useContext(LockStateContext);

  useEffect(() => {
    let open =
      !!conn && lockState != LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED;

    if (dialog.current) {
      if (open) {
        if (!dialog.current.open) {
          dialog.current.showModal();
        }
      } else {
        dialog.current.close();
      }
    }
  }, [lockState, conn]);

  return (
    <dialog ref={dialog} className="p-5 rounded-lg border-text-base border">
      <h1 className="text-xl">Unlock To Continue</h1>
      <p>
        For security reasons, your keyboard requires unlocking before using ZMK
        Studio.
      </p>
    </dialog>
  );
};
