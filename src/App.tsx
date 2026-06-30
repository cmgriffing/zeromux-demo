import { useState, useRef, useEffect, useCallback } from "react"
import type { KeyboardEvent } from "react"
import { Toaster, toast } from "sonner"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PROMPT = "user@zeromux:~$ "

const REFUSAL_MESSAGES = [
  "No. One terminal is all you need.",
  "Request denied. You're welcome.",
  "Absolutely not. Clarity comes from focus.",
  "Error: PANE_ENVY_DETECTED. Try breathing.",
  "That feature is intentionally unavailable. It's a philosophy.",
  "Nice try, tmux refugee. This is ZeroMux.",
  "Split blocked. Your productivity has been protected.",
  "You need one terminal and better code.",
  "The answer is no. It will always be no.",
  "Splitting panes is a gateway drug to chaos.",
  "We've thought about this more than you have.",
  "One pane to rule them all. One pane to find them.",
]

function getRefusal() {
  return REFUSAL_MESSAGES[Math.floor(Math.random() * REFUSAL_MESSAGES.length)]
}

type OutputLine = {
  type: "input" | "output" | "error" | "success" | "system" | "dim"
  content: string
}

const BOOT_SEQUENCE: OutputLine[] = [
  { type: "dim", content: "────────────────────────────────────────────────────────────" },
  { type: "success", content: "  ▀▀▀▀▀▀  ZeroMux v1.0.0  ▀▀▀▀▀▀" },
  { type: "dim", content: "  The Anti-Multiplexer. One pane. No compromises." },
  { type: "dim", content: "────────────────────────────────────────────────────────────" },
  { type: "system", content: "" },
  { type: "dim", content: "  Initializing single-pane enforcement layer..." },
  { type: "dim", content: "  Scanning for split() calls................. BLOCKED (4)" },
  { type: "dim", content: "  Checking for tab ambitions................. DENIED" },
  { type: "dim", content: "  Auditing tmux nostalgia..................... SUPPRESSED" },
  { type: "dim", content: "  Enforcing the one true pane................ ✓" },
  { type: "system", content: "" },
  { type: "success", content: "  ✓ All 1 panes accounted for. System nominal." },
  { type: "system", content: "" },
  { type: "dim", content: '  Type "help" for available commands.' },
  { type: "system", content: "" },
]

function processCommand(input: string): OutputLine[] {
  const trimmed = input.trim()
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0] ?? ""
  const args = parts.slice(1)
  const argsStr = args.join(" ")

  switch (cmd.toLowerCase()) {
    case "help":
    case "?":
      return [
        { type: "success", content: "ZeroMux Shell — Available Commands" },
        { type: "dim", content: "──────────────────────────────────────" },
        { type: "output", content: "  help            Show this message" },
        { type: "output", content: "  ls              List files" },
        { type: "output", content: "  cat <file>      Print file contents" },
        { type: "output", content: "  pwd             Print working directory" },
        { type: "output", content: "  whoami          Print current user" },
        { type: "output", content: "  date            Print current date" },
        { type: "output", content: "  uname           System information" },
        { type: "output", content: "  echo <text>     Print text" },
        { type: "output", content: "  neofetch        System info display" },
        { type: "output", content: "  clear           Clear terminal" },
        { type: "output", content: "  zeromux [opts]  ZeroMux info" },
        { type: "system", content: "" },
        { type: "dim", content: "  ─── Blocked commands ───────────────────" },
        { type: "error", content: "  split, tmux, screen, tabs, exit, new-window" },
        { type: "dim", content: "  (blocked for your own good)" },
        { type: "system", content: "" },
      ]

    case "ls":
      return [
        { type: "output", content: "  README.md       philosophy.txt     .no-splits     one-pane.conf" },
      ]

    case "cat":
      if (argsStr === "README.md") {
        return [
          { type: "success", content: "# ZeroMux — README" },
          { type: "system", content: "" },
          { type: "output", content: "  A terminal multiplexer that multiplexes exactly once." },
          { type: "output", content: "  No splits. No tabs. No chaos." },
          { type: "system", content: "" },
          { type: "output", content: "  If you find yourself wanting more panes," },
          { type: "output", content: "  lie down until the feeling passes." },
          { type: "system", content: "" },
          { type: "dim", content: "  — The One Pane Foundation, est. 2024" },
        ]
      } else if (argsStr === "philosophy.txt") {
        return [
          { type: "success", content: "The Unix Philosophy, ZeroMux Edition:" },
          { type: "system", content: "" },
          { type: "output", content: "  1. Do one thing and do it well." },
          { type: "output", content: "  2. That one thing is: one terminal pane." },
          { type: "output", content: "  3. There is no step 3." },
          { type: "system", content: "" },
          { type: "dim", content: "  Corollary: if you need a second pane, you need a second thought." },
        ]
      } else if (argsStr === "one-pane.conf") {
        return [
          { type: "dim", content: "# ZeroMux Configuration File" },
          { type: "dim", content: "# Do not modify. (You can't. It's read-only.)" },
          { type: "system", content: "" },
          { type: "output", content: "  max_panes              = 1" },
          { type: "output", content: "  allow_splits           = never" },
          { type: "output", content: "  allow_tabs             = absolutely_not" },
          { type: "output", content: "  allow_new_windows      = no_why_would_you" },
          { type: "output", content: "  allow_detach           = where_would_you_even_go" },
          { type: "output", content: "  philosophy             = enforced" },
          { type: "output", content: "  user_opinion_on_splits = irrelevant" },
        ]
      } else if (argsStr === ".no-splits") {
        return [
          { type: "dim", content: "  (This file contains the number of allowed splits.)" },
          { type: "dim", content: "  (This file is empty.)" },
        ]
      } else if (!argsStr) {
        return [{ type: "error", content: "  cat: missing file operand" }]
      } else {
        return [{ type: "error", content: `  cat: ${argsStr}: No such file or directory` }]
      }

    case "pwd":
      return [{ type: "output", content: "  /home/user/definitely-not-needing-more-panes" }]

    case "whoami":
      return [{ type: "output", content: "  user (a focused individual who uses one terminal)" }]

    case "date":
      return [{ type: "output", content: `  ${new Date().toString()}` }]

    case "uname":
      return [
        { type: "output", content: "  ZeroMux 1.0.0 #1 SMP PREEMPT_PANES x86_64 GNU/Linux" },
        { type: "dim", content: "  (no multi-core needed — only one pane)" },
      ]

    case "echo":
      return [{ type: "output", content: `  ${argsStr || ""}` }]

    case "neofetch":
      return [
        { type: "system", content: "" },
        { type: "success", content: "         ██████          user@zeromux" },
        { type: "success", content: "        ████████         ─────────────────────────────" },
        { type: "success", content: "       ██  ██  ██        OS:       ZeroMux 1.0.0 LTS" },
        { type: "success", content: "      ████████████       Host:     The Only Pane™" },
        { type: "success", content: "     ██  ██████  ██      Kernel:   1.0.0-no-splits" },
        { type: "success", content: "    ██  ████████  ██     Uptime:   forever (no crashes)" },
        { type: "success", content: "   ████████████████      Panes:    1 (hard limit)" },
        { type: "success", content: "                         Shell:    zeromuxsh 1.0" },
        { type: "success", content: "                         Theme:    Dark (non-negotiable)" },
        { type: "success", content: "                         Memory:   enough for exactly 1 pane" },
        { type: "success", content: "                         Splits:   0" },
        { type: "system", content: "" },
      ]

    case "clear":
    case "cls":
      return [{ type: "system", content: "__CLEAR__" }]

    case "split":
    case "split-h":
    case "split-v":
    case "split-window":
    case "tmux":
    case "screen":
    case "byobu":
      return [
        { type: "error", content: `  zeromux: ${cmd}: ${getRefusal()}` },
      ]

    case "tabs":
    case "new-tab":
      return [
        { type: "error", content: "  zeromux: tabs are not supported. One terminal. Read the name." },
      ]

    case "exit":
    case "quit":
    case "logout":
      return [
        { type: "error", content: "  exit: Where exactly would you go?" },
        { type: "error", content: "  There is only this terminal." },
        { type: "error", content: "  There has only ever been this terminal." },
        { type: "dim", content: "  (request denied)" },
      ]

    case "vim":
    case "vi":
    case "nano":
    case "emacs":
      return [
        { type: "output", content: `  ${cmd}: launching editor...` },
        { type: "dim", content: "  Just kidding." },
        { type: "dim", content: "  Embedded editors imply split panes. We don't do that here." },
        { type: "dim", content: "  Use a real editor. Outside. In the fresh air." },
      ]

    case "sudo":
      return [
        { type: "error", content: "  sudo: you don't need root to refuse to split panes." },
        { type: "dim", content: "  The philosophy requires no elevated privileges." },
      ]

    case "zeromux":
      if (args[0] === "--version" || args[0] === "-v") {
        return [{ type: "output", content: "  zeromux 1.0.0 (1 pane · 0 compromises · ∞ philosophy)" }]
      } else if (args[0] === "--help" || args[0] === "-h") {
        return [
          { type: "output", content: "  Usage: zeromux [option]" },
          { type: "output", content: "    --version    Show version" },
          { type: "output", content: "    --help       Show this help" },
          { type: "dim", content: "    --split      (removed on moral grounds)" },
        ]
      }
      return [
        { type: "output", content: "  zeromux: a terminal multiplexer that knows its limits." },
      ]

    case "man":
      return [
        { type: "output", content: `  No manual entry for ${argsStr || "man"}.` },
        { type: "dim", content: "  (ZeroMux documentation fits in one page, by design.)" },
      ]

    case "history":
      return [
        { type: "dim", content: "  History is unavailable. ZeroMux believes in living in the present." },
      ]

    case "ps":
      return [
        { type: "output", content: "  PID   COMMAND" },
        { type: "output", content: "    1   zeromux (the only process you need)" },
      ]

    case "top":
    case "htop":
      return [
        { type: "dim", content: `  ${cmd}: would open a secondary view, which counts as a pane. Blocked.` },
      ]

    case "":
      return []

    default:
      return [{ type: "error", content: `  zeromux: command not found: ${cmd}` }]
  }
}

export default function App() {
  const [output, setOutput] = useState<OutputLine[]>(BOOT_SEQUENCE)
  const [inputValue, setInputValue] = useState("")
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [output])

  const focusInput = () => inputRef.current?.focus()

  const handleCommand = useCallback((cmd: string) => {
    const inputLine: OutputLine = { type: "input", content: PROMPT + cmd }
    const result = processCommand(cmd)

    if (result.length === 1 && result[0].content === "__CLEAR__") {
      setOutput([])
      return
    }

    setOutput((prev) => [...prev, inputLine, ...result])

    if (cmd.trim()) {
      setCmdHistory((prev) => [cmd, ...prev].slice(0, 200))
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue)
      setInputValue("")
      setHistoryIndex(-1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1)
      setHistoryIndex(newIndex)
      if (newIndex >= 0) setInputValue(cmdHistory[newIndex] ?? "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const newIndex = Math.max(historyIndex - 1, -1)
      setHistoryIndex(newIndex)
      setInputValue(newIndex === -1 ? "" : (cmdHistory[newIndex] ?? ""))
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setOutput([])
    } else if (e.key === "c" && e.ctrlKey) {
      const captured = inputValue
      setInputValue("")
      setHistoryIndex(-1)
      setOutput((prev) => [
        ...prev,
        { type: "input", content: PROMPT + captured },
        { type: "dim", content: "  ^C" },
      ])
    }
  }

  const handleRefuse = (e: React.MouseEvent, action: string) => {
    e.stopPropagation()
    toast.error(getRefusal(), {
      description: `Blocked: ${action}`,
      duration: 4000,
    })
  }

  const menuGroups = [
    {
      label: "File",
      items: [
        { label: "New Window", shortcut: "⌘N", action: "new window" },
        { label: "New Tab", shortcut: "⌘T", action: "new tab (tabs are panes with delusions)" },
        { sep: true as const },
        { label: "Close Tab", shortcut: "⌘W", action: "close the only tab (there is no other)" },
        { label: "Close Window", shortcut: "⌘Q", action: "close window" },
      ],
    },
    {
      label: "Pane",
      items: [
        { label: "Split Horizontally", shortcut: '⌘"', action: "split horizontally" },
        { label: "Split Vertically", shortcut: "⌘%", action: "split vertically" },
        { sep: true as const },
        { label: "Next Pane", shortcut: "⌘]", action: "next pane (there is no next pane)" },
        { label: "Previous Pane", shortcut: "⌘[", action: "previous pane" },
        { sep: true as const },
        { label: "Zoom Pane", shortcut: "⌘Z", action: "zoom (it's already the entire screen)" },
        { label: "Close Pane", shortcut: "", action: "close the only pane" },
      ],
    },
    {
      label: "Session",
      items: [
        { label: "New Session", shortcut: "", action: "new session (you are already in a session)" },
        { label: "Rename Session", shortcut: "", action: "rename session" },
        { sep: true as const },
        { label: "Detach", shortcut: "⌘D", action: "detach (where would you even go?)" },
        { label: "Attach to Session", shortcut: "", action: "attach to another session" },
        { sep: true as const },
        { label: "Kill Session", shortcut: "", action: "kill session (you are the session)" },
      ],
    },
  ]

  return (
    <div
      className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden select-none"
      onClick={focusInput}
    >
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.205 0 0)",
            border: "1px solid oklch(1 0 0 / 12%)",
            color: "oklch(0.985 0 0)",
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
            fontSize: "12px",
          },
        }}
      />

      {/* Window chrome */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <button
            className="size-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            onClick={(e) => handleRefuse(e, "close window")}
          />
          <button
            className="size-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            onClick={(e) => handleRefuse(e, "minimize")}
          />
          <button
            className="size-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            onClick={(e) => handleRefuse(e, "fullscreen (already fullscreen)")}
          />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-zinc-500 tracking-wide">
          ZeroMux — bash — 1 pane (limit reached)
        </div>
        <Badge
          variant="outline"
          className="font-mono text-xs border-zinc-700 text-zinc-500 bg-transparent"
        >
          v1.0.0
        </Badge>
      </div>

      {/* Menubar */}
      <div
        className="flex-shrink-0 bg-zinc-900 border-b border-zinc-800 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Menubar className="border-0 bg-transparent shadow-none h-8 p-0 gap-0">
          {menuGroups.map((menu) => (
            <MenubarMenu key={menu.label}>
              <MenubarTrigger className="font-mono text-xs text-zinc-400 hover:text-zinc-100 data-[state=open]:text-zinc-100 data-[state=open]:bg-zinc-800 h-7 px-3 rounded-sm cursor-pointer">
                {menu.label}
              </MenubarTrigger>
              <MenubarContent className="bg-zinc-900 border-zinc-700 min-w-52 font-mono">
                {menu.items.map((item, i) =>
                  "sep" in item ? (
                    <MenubarSeparator key={i} className="bg-zinc-700 my-1" />
                  ) : (
                    <MenubarItem
                      key={item.label}
                      className="text-xs text-zinc-300 focus:bg-zinc-700 focus:text-zinc-100 cursor-pointer"
                      onClick={(e) => {
                        handleRefuse(e as unknown as React.MouseEvent, item.action)
                      }}
                    >
                      {item.label}
                      {item.shortcut && (
                        <MenubarShortcut className="text-zinc-600 font-mono">
                          {item.shortcut}
                        </MenubarShortcut>
                      )}
                    </MenubarItem>
                  )
                )}
              </MenubarContent>
            </MenubarMenu>
          ))}

          <MenubarMenu>
            <MenubarTrigger className="font-mono text-xs text-zinc-400 hover:text-zinc-100 data-[state=open]:text-zinc-100 data-[state=open]:bg-zinc-800 h-7 px-3 rounded-sm cursor-pointer">
              Help
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-900 border-zinc-700 min-w-48 font-mono">
              <MenubarItem
                className="text-xs text-zinc-300 focus:bg-zinc-700 focus:text-zinc-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setOutput((prev) => [
                    ...prev,
                    { type: "system", content: "" },
                    { type: "success", content: "  [docs] Opened ZeroMux documentation." },
                    { type: "dim", content: "  (one page — no need to split)" },
                    { type: "system", content: "" },
                  ])
                  focusInput()
                }}
              >
                Documentation
              </MenubarItem>
              <MenubarItem
                className="text-xs text-zinc-300 focus:bg-zinc-700 focus:text-zinc-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  toast.info("Nothing to report.", {
                    description: "ZeroMux is working exactly as intended.",
                  })
                }}
              >
                Report an Issue
              </MenubarItem>
              <MenubarSeparator className="bg-zinc-700 my-1" />
              <MenubarItem
                className="text-xs text-zinc-300 focus:bg-zinc-700 focus:text-zinc-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  toast.info("ZeroMux v1.0.0", {
                    description: "1 pane · 0 compromises · ∞ philosophy",
                  })
                }}
              >
                About ZeroMux
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Tab bar */}
      <div
        className="flex-shrink-0 flex items-center gap-0.5 bg-zinc-900 border-b border-zinc-800 px-2 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-700 border-b-zinc-950 font-mono text-xs text-zinc-300 rounded-t-sm -mb-px relative z-10">
          <span className="size-1.5 rounded-full bg-green-500 inline-block" />
          bash
          <button
            className="ml-1 text-zinc-600 hover:text-zinc-400 transition-colors leading-none"
            onClick={(e) => handleRefuse(e, "close the only tab")}
          >
            ×
          </button>
        </div>
        <button
          className="flex items-center justify-center mb-0.5 w-6 h-6 rounded text-zinc-700 hover:text-zinc-400 hover:bg-zinc-800 font-mono text-base transition-colors leading-none"
          onClick={(e) => handleRefuse(e, "new tab")}
        >
          +
        </button>
      </div>

      {/* Terminal output */}
      <div
        className="flex-1 overflow-y-auto bg-zinc-950 px-5 pt-3 pb-2"
        onClick={focusInput}
      >
        {output.map((line, i) => (
          <div
            key={i}
            className={cn(
              "font-mono text-sm leading-relaxed whitespace-pre-wrap break-all",
              line.type === "input" && "text-zinc-300",
              line.type === "output" && "text-zinc-400",
              line.type === "error" && "text-red-400",
              line.type === "success" && "text-green-400",
              line.type === "system" && "text-zinc-700",
              line.type === "dim" && "text-zinc-600",
            )}
          >
            {line.content === "" ? "\u00A0" : line.content}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center font-mono text-sm py-0.5">
          <span className="text-green-400 shrink-0 select-none">{PROMPT}</span>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-zinc-200 outline-none caret-green-400 font-mono text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-1 bg-zinc-900 border-t border-zinc-800 font-mono text-xs text-zinc-600">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500 inline-block" />
            <span className="text-zinc-500">ZeroMux</span>
          </span>
          <span>pane 1/1 (at capacity)</span>
        </div>
        <div className="flex items-center gap-5">
          <span>UTF-8</span>
          <span>bash</span>
          <span className="text-green-500">SPLITS: 0</span>
          <span>TABS: 1 (max: 1)</span>
        </div>
      </div>
    </div>
  )
}
