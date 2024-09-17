import * as Y from 'yjs'
import React, { useCallback } from 'react'
import { ChevronDoubleRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import Spin from './Spin'
import { BlockType } from '@briefer/editor'
import { FolderIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import { Tooltip } from './Tooltips'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props {
  workspaceId: string
  visible: boolean
  onHide: () => void
  yDoc?: Y.Doc
}

type ReusableComponent = {
  id: string
  name: string
  source: string
  blockType: BlockType
  lastSavedAt: Date
}

const hardcodedComponents: ReusableComponent[] = [
  {
    id: '123901231',
    name: 'Component 1',
    source: 'source1',
    blockType: BlockType.SQL,
    lastSavedAt: new Date(),
  },
  {
    id: '123901232',
    name: 'Component 2',
    source: 'source1',
    blockType: BlockType.Python,
    lastSavedAt: new Date(),
  },
  {
    id: '123901233',
    name: 'Component 3',
    source: 'source3',
    blockType: BlockType.SQL,
    lastSavedAt: new Date(),
  },
]

export default function ReusableComponents(props: Props) {
  return (
    <>
      <Transition
        as="div"
        show={props.visible}
        className="top-0 right-0 h-full absolute bg-white z-30"
        enter="transition-transform duration-300"
        enterFrom="transform translate-x-full"
        enterTo="transform translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="transform translate-x-0"
        leaveTo="transform translate-x-full"
      >
        <button
          className="absolute z-10 top-7 transform rounded-full border border-gray-300 text-gray-400 bg-white hover:bg-gray-100 w-6 h-6 flex justify-center items-center left-0 -translate-x-1/2"
          onClick={props.onHide}
        >
          <ChevronDoubleRightIcon className="w-3 h-3" />
        </button>
        <div className="w-[324px] flex flex-col border-l border-gray-200 h-full bg-white">
          <div className="flex justify-between border-b p-6 space-x-3">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 pr-1.5">
                Reusable Components
              </h3>
              <p className="text-gray-500 text-sm pt-1">
                {'Click a component to add it to the current page.'}
              </p>
            </div>
          </div>
          {true && (
            <>
              {hardcodedComponents.length > 0 ? (
                <ul role="list" className="flex-1 overflow-y-scroll">
                  {hardcodedComponents.map((component, i) => (
                    <li
                      key={component.id}
                      className={clsx('border-gray-200 border-b')}
                    >
                      <ReusableComponentItem
                        workspaceId={props.workspaceId}
                        component={component}
                        onUse={() => {}}
                        onDelete={() => {}}
                        seeUsage={() => {}}
                        isDeleting={false}
                        canUse={props.yDoc !== undefined}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                    Drag and drop files here to upload them.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Transition>
    </>
  )
}

interface ComponentItemProps {
  workspaceId: string
  component: ReusableComponent
  onUse: () => void
  onDelete: () => void
  seeUsage: () => void
  isDeleting: boolean
  canUse: boolean
}

function ReusableComponentItem(props: ComponentItemProps) {
  const onUse = useCallback(() => {
    props.onUse()
  }, [props.onUse, props.component])

  const onRemove = useCallback(() => {
    props.onDelete()
  }, [props.onDelete, props.component])

  return (
    <div className="px-4 py-3 font-sans block w-full">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div
            className="font-medium pr-2 text-sm break-all"
            title={props.component.name}
          >
            {props.component.name}
          </div>
          <div>
            <button
              className="text-gray-500 hover:text-red-500 disabled:cursor-not-allowed"
              onClick={onRemove}
              disabled={props.isDeleting}
            >
              {props.isDeleting ? <Spin /> : <TrashIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 font-medium text-gray-400 text-xs">
            {props.component.blockType === BlockType.SQL
              ? 'SQL'
              : props.component.blockType === BlockType.Python
              ? 'Python'
              : 'Unknown'}

            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>
            {props.component.source}
          </div>
          <div className="flex items-center gap-x-2 font-medium text-gray-400 text-xs">
            Saved at{' '}
            {format(
              new Date(props.component.lastSavedAt),
              "h:mm a '-' do MMM, yyyy"
            )}
          </div>
        </div>

        <div className="flex pt-3 text-xs font-medium">
          <Tooltip
            position="manual"
            title=""
            message="You must be in a notebook to use this file."
            active={!props.canUse}
            tooltipClassname="-top-1 w-44 -translate-y-full"
          >
            <button
              className="text-gray-500 hover:text-gray-400 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
              onClick={onUse}
              disabled={props.isDeleting || !props.canUse}
            >
              Add to notebook
            </button>
          </Tooltip>
          <span className="text-gray-300 px-1">/</span>
          <Tooltip
            title=""
            message="You must be in a notebook to use this file."
            active={!props.canUse}
            tooltipClassname="w-44"
          >
            <button
              className="text-gray-500 hover:text-gray-400 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
              onClick={props.seeUsage}
              disabled={props.isDeleting}
            >
              See usage
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
