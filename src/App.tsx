import { appWindow } from '@tauri-apps/api/window';
import { useState } from 'react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import SettingDialog from '@/components/setting-dialog';
import Clock from './components/clock';

function App() {
  const [windowMode, setWindowMode] = useState(0);
  const [settingDialog, setSettingDialog] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            data-tauri-drag-region
            className="h-screen w-screen grid grid-cols-3"
          >
            <Clock className="mt-8 col-start-2" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onSelect={() => setSettingDialog(true)}>
            壁紙を変更...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={windowMode === 0 ? true : undefined}
            disabled={windowMode === 0 ? true : undefined}
            onClick={() => {
              setWindowMode(0);
              appWindow.unmaximize();
            }}
          >
            通常ウィンドウ
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={windowMode === 1 ? true : undefined}
            disabled={windowMode === 1 ? true : undefined}
            onClick={() => {
              setWindowMode(1);
              appWindow.maximize();
            }}
          >
            最大化
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            onClick={() => {
              appWindow.close();
            }}
          >
            画面を閉じる
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
      <SettingDialog open={settingDialog} onOpenChange={setSettingDialog} />
    </>
  );
}

export default App;
