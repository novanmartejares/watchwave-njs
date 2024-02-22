import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link as NLink,
} from "@nextui-org/react";
import Link from "next/link";

// interface for props
interface ModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  type: "adBlock" | "watchlist";
  data?: any;
}

export const ModalManager = ({
  isOpen,
  onClose,
  onOpenChange,
  data,
  type,
}: ModalProps) => {
  if (type === "adBlock")
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Use Ad Blocker
            </ModalHeader>
            <ModalBody>
              {/* <p>
								It is <b>highly</b> recommended that you use an ad blocker such as{' '}
								<NLink as={Link} isExternal href="https://github.com/gorhill/uBlock#readme">
									Ublock Origin
								</NLink>{' '}
								while watching videos on WatchWave. There are spammy ads on the video players, which are out of our control and
								can&apos;t be disabled. Using an ad blocker is an easy solution to get rid of the ads on the video players.
							</p> */}
              <div className="px-2">
                To block ads:
                <ul className="list-decimal">
                  <li>
                    <span className="font-bold">On desktop:</span> Use{" "}
                    <NLink
                      as={Link}
                      isExternal
                      href="https://github.com/gorhill/uBlock#readme"
                    >
                      Ublock Origin
                    </NLink>
                  </li>
                  <li>
                    <span className="font-bold">On any other device:</span> Use{" "}
                    <NLink
                      as={Link}
                      isExternal
                      href="https://brave.com/download/"
                    >
                      Brave Browser
                    </NLink>
                  </li>
                </ul>
                <p className="mt-2">
                  It is highly recommended to use an ad blocker since there are
                  spammy ads on the video players, which are out of our control
                  and can't be disabled. Using an ad blocker is an easy solution
                  to get rid of the ads on the video players.
                </p>
              </div>

              <br />
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  onClose();
                }}
                variant="ghost"
              >
                Ok
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    );

  if (type === "watchlist")
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add to Watchlist
              </ModalHeader>
              <ModalBody>
                <p>You need to be logged in to add to watchlist.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    try {
                      data.googleSignIn();
                      onClose();
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
};

// Define other modals in a similar manner
