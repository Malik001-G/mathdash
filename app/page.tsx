"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Home,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Cell = {
  value: number | string;
  isBlank: boolean;
  correctAnswer?: number;
  id: string;
};

type GridPuzzle = {
  grid: Cell[][];
  numberBank: number[];
  rows: number;
  cols: number;
};

const PUZZLES = {
  Easy: [
    {
      grid: [
        [
          { value: 12, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 24, isBlank: true, correctAnswer: 24, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 36, isBlank: false, id: "0-4" },
        ],
        [
          { value: "/", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "/", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "", isBlank: false, id: "1-4" },
        ],
        [
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 6, isBlank: true, correctAnswer: 6, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: -2, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "", isBlank: false, id: "3-4" },
        ],
        [
          { value: 3, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 4, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: "", isBlank: false, id: "4-4" },
        ],
      ],
      numberBank: [24, 4, 6],
      rows: 5,
      cols: 5,
    },
    {
      grid: [
        [
          { value: 8, isBlank: true, correctAnswer: 8, id: "0-0" },
          { value: "-", isBlank: false, id: "0-1" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 4, isBlank: false, id: "0-4" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "=", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "", isBlank: false, id: "1-4" },
        ],
        [
          { value: 7, isBlank: true, correctAnswer: 7, id: "2-0" },
          { value: "", isBlank: false, id: "2-1" },
          { value: 4, isBlank: false, id: "2-2" },
          { value: "", isBlank: false, id: "2-3" },
          { value: "", isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "", isBlank: false, id: "3-4" },
        ],
        [
          { value: 56, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: "", isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: "", isBlank: false, id: "4-4" },
        ],
      ],
      numberBank: [8, 4, 7],
      rows: 5,
      cols: 5,
    },
  ],
  Medium: [
    {
      grid: [
        [
          { value: 15, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 9, isBlank: true, correctAnswer: 9, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 24, isBlank: false, id: "0-4" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "/", isBlank: false, id: "1-4" },
        ],
        [
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 2, isBlank: true, correctAnswer: 2, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 2, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 60, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 18, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 12, isBlank: true, correctAnswer: 12, id: "4-4" },
        ],
      ],
      numberBank: [9, 4, 2, 12],
      rows: 5,
      cols: 5,
    },
    {
      grid: [
        [
          { value: 20, isBlank: false, id: "0-0" },
          { value: "-", isBlank: false, id: "0-1" },
          { value: 9, isBlank: true, correctAnswer: 9, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 11, isBlank: false, id: "0-4" },
        ],
        [
          { value: "+", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "*", isBlank: false, id: "1-4" },
        ],
        [
          { value: 12, isBlank: true, correctAnswer: 12, id: "2-0" },
          { value: "+", isBlank: false, id: "2-1" },
          { value: 5, isBlank: true, correctAnswer: 5, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 17, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 32, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 45, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 187, isBlank: true, correctAnswer: 187, id: "4-4" },
        ],
      ],
      numberBank: [9, 12, 5, 187],
      rows: 5,
      cols: 5,
    },
  ],
  Hard: [
    {
      grid: [
        [
          { value: 48, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 16, isBlank: true, correctAnswer: 16, id: "0-2" },
          { value: "-", isBlank: false, id: "0-3" },
          { value: 8, isBlank: false, id: "0-4" },
          { value: "=", isBlank: false, id: "0-5" },
          { value: 56, isBlank: false, id: "0-6" },
        ],
        [
          { value: "÷", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "+", isBlank: false, id: "1-4" },
          { value: "", isBlank: false, id: "1-5" },
          { value: "", isBlank: false, id: "1-6" },
        ],
        [
          { value: 6, isBlank: true, correctAnswer: 6, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 2, isBlank: false, id: "2-2" },
          { value: "*", isBlank: false, id: "2-3" },
          { value: 5, isBlank: true, correctAnswer: 5, id: "2-4" },
          { value: "=", isBlank: false, id: "2-5" },
          { value: 20, isBlank: false, id: "2-6" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
          { value: "", isBlank: false, id: "3-5" },
          { value: "", isBlank: false, id: "3-6" },
        ],
        [
          { value: 8, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 32, isBlank: true, correctAnswer: 32, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 13, isBlank: true, correctAnswer: 13, id: "4-4" },
          { value: "", isBlank: false, id: "4-5" },
          { value: "", isBlank: false, id: "4-6" },
        ],
      ],
      numberBank: [16, 8, 6, 2, 5, 32, 13],
      rows: 5,
      cols: 7,
    },
    {
      grid: [
        [
          { value: 72, isBlank: false, id: "0-0" },
          { value: "÷", isBlank: false, id: "0-1" },
          { value: 9, isBlank: false, id: "0-2" },
          { value: "+", isBlank: false, id: "0-3" },
          { value: 15, isBlank: true, correctAnswer: 15, id: "0-4" },
          { value: "=", isBlank: false, id: "0-5" },
          { value: 23, isBlank: false, id: "0-6" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "-", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "*", isBlank: false, id: "1-4" },
          { value: "", isBlank: false, id: "1-5" },
          { value: "", isBlank: false, id: "1-6" },
        ],
        [
          { value: 3, isBlank: true, correctAnswer: 3, id: "2-0" },
          { value: "+", isBlank: false, id: "2-1" },
          { value: 7, isBlank: false, id: "2-2" },
          { value: "-", isBlank: false, id: "2-3" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-4" },
          { value: "=", isBlank: false, id: "2-5" },
          { value: 6, isBlank: false, id: "2-6" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
          { value: "", isBlank: false, id: "3-5" },
          { value: "", isBlank: false, id: "3-6" },
        ],
        [
          { value: 216, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 2, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 60, isBlank: true, correctAnswer: 60, id: "4-4" },
          { value: "", isBlank: false, id: "4-5" },
          { value: "", isBlank: false, id: "4-6" },
        ],
      ],
      numberBank: [9, 15, 3, 7, 4, 216, 60],
      rows: 5,
      cols: 7,
    },
    {
      grid: [
        [
          { value: 25, isBlank: false, id: "0-0" },
          { value: "*", isBlank: false, id: "0-1" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "0-2" },
          { value: "+", isBlank: false, id: "0-3" },
          { value: 10, isBlank: true, correctAnswer: 10, id: "0-4" },
          { value: "=", isBlank: false, id: "0-5" },
          { value: 110, isBlank: false, id: "0-6" },
        ],
        [
          { value: "-", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "+", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "÷", isBlank: false, id: "1-4" },
          { value: "", isBlank: false, id: "1-5" },
          { value: "", isBlank: false, id: "1-6" },
        ],
        [
          { value: 15, isBlank: true, correctAnswer: 15, id: "2-0" },
          { value: "*", isBlank: false, id: "2-1" },
          { value: 3, isBlank: true, correctAnswer: 3, id: "2-2" },
          { value: "-", isBlank: false, id: "2-3" },
          { value: 5, isBlank: true, correctAnswer: 5, id: "2-4" },
          { value: "=", isBlank: false, id: "2-5" },
          { value: 40, isBlank: false, id: "2-6" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
          { value: "", isBlank: false, id: "3-5" },
          { value: "", isBlank: false, id: "3-6" },
        ],
        [
          { value: 10, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 7, isBlank: true, correctAnswer: 7, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 2, isBlank: true, correctAnswer: 2, id: "4-4" },
          { value: "", isBlank: false, id: "4-5" },
          { value: "", isBlank: false, id: "4-6" },
        ],
      ],
      numberBank: [4, 10, 15, 3, 5, 7, 2],
      rows: 5,
      cols: 7,
    },
    {
      grid: [
        [
          { value: 100, isBlank: false, id: "0-0" },
          { value: "÷", isBlank: false, id: "0-1" },
          { value: 5, isBlank: true, correctAnswer: 5, id: "0-2" },
          { value: "*", isBlank: false, id: "0-3" },
          { value: 3, isBlank: true, correctAnswer: 3, id: "0-4" },
          { value: "=", isBlank: false, id: "0-5" },
          { value: 60, isBlank: false, id: "0-6" },
        ],
        [
          { value: "+", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "-", isBlank: false, id: "1-4" },
          { value: "", isBlank: false, id: "1-5" },
          { value: "", isBlank: false, id: "1-6" },
        ],
        [
          { value: 20, isBlank: true, correctAnswer: 20, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 8, isBlank: true, correctAnswer: 8, id: "2-2" },
          { value: "+", isBlank: false, id: "2-3" },
          { value: 6, isBlank: true, correctAnswer: 6, id: "2-4" },
          { value: "=", isBlank: false, id: "2-5" },
          { value: 18, isBlank: false, id: "2-6" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
          { value: "", isBlank: false, id: "3-5" },
          { value: "", isBlank: false, id: "3-6" },
        ],
        [
          { value: 120, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 40, isBlank: true, correctAnswer: 40, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: -3, isBlank: true, correctAnswer: -3, id: "4-4" },
          { value: "", isBlank: false, id: "4-5" },
          { value: "", isBlank: false, id: "4-6" },
        ],
      ],
      numberBank: [5, 3, 20, 8, 6, 40, -3],
      rows: 5,
      cols: 7,
    },
    {
      grid: [
        [
          { value: 64, isBlank: false, id: "0-0" },
          { value: "÷", isBlank: false, id: "0-1" },
          { value: 8, isBlank: true, correctAnswer: 8, id: "0-2" },
          { value: "-", isBlank: false, id: "0-3" },
          { value: 2, isBlank: true, correctAnswer: 2, id: "0-4" },
          { value: "=", isBlank: false, id: "0-5" },
          { value: 6, isBlank: false, id: "0-6" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "+", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "*", isBlank: false, id: "1-4" },
          { value: "", isBlank: false, id: "1-5" },
          { value: "", isBlank: false, id: "1-6" },
        ],
        [
          { value: 2, isBlank: true, correctAnswer: 2, id: "2-0" },
          { value: "+", isBlank: false, id: "2-1" },
          { value: 12, isBlank: true, correctAnswer: 12, id: "2-2" },
          { value: "÷", isBlank: false, id: "2-3" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-4" },
          { value: "=", isBlank: false, id: "2-5" },
          { value: 14, isBlank: false, id: "2-6" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
          { value: "", isBlank: false, id: "3-5" },
          { value: "", isBlank: false, id: "3-6" },
        ],
        [
          { value: 128, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 20, isBlank: true, correctAnswer: 20, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 8, isBlank: true, correctAnswer: 8, id: "4-4" },
          { value: "", isBlank: false, id: "4-5" },
          { value: "", isBlank: false, id: "4-6" },
        ],
      ],
      numberBank: [8, 2, 2, 12, 4, 20, 8],
      rows: 5,
      cols: 7,
    },
  ],
};

const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<{
    oscillators: OscillatorNode[];
    gainNode: GainNode;
    interval: NodeJS.Timeout;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playSound = (
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const startBackgroundMusic = () => {
    if (isMuted || backgroundMusicRef.current) return;

    const ctx = getAudioContext();

    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const oscillator3 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    oscillator1.connect(filterNode);
    oscillator2.connect(filterNode);
    oscillator3.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    const chords = [
      [261.63, 329.63, 392.0],
      [293.66, 369.99, 440.0],
      [246.94, 311.13, 369.99],
      [261.63, 329.63, 392.0],
    ];

    let chordIndex = 0;

    oscillator1.type = "sine";
    oscillator2.type = "sine";
    oscillator3.type = "triangle";
    filterNode.type = "lowpass";
    filterNode.frequency.value = 1500;

    const setChord = (index: number) => {
      const now = ctx.currentTime;
      oscillator1.frequency.setValueAtTime(chords[index][0], now);
      oscillator2.frequency.setValueAtTime(chords[index][1], now);
      oscillator3.frequency.setValueAtTime(chords[index][2] / 2, now);
    };

    setChord(0);
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

    const changeChord = () => {
      chordIndex = (chordIndex + 1) % chords.length;
      setChord(chordIndex);
    };

    const interval = setInterval(changeChord, 2000);
    oscillator1.start();
    oscillator2.start();
    oscillator3.start();

    backgroundMusicRef.current = {
      oscillators: [oscillator1, oscillator2, oscillator3],
      gainNode,
      interval,
    };
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      clearInterval(backgroundMusicRef.current.interval);
      backgroundMusicRef.current.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      });
      backgroundMusicRef.current = null;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState) {
      stopBackgroundMusic();
    } else {
      setTimeout(() => startBackgroundMusic(), 100);
    }
  };

  const sounds = {
    click: () => playSound(800, 0.1, "sine"),
    correct: () => {
      playSound(523, 0.1, "sine");
      setTimeout(() => playSound(659, 0.1, "sine"), 100);
      setTimeout(() => playSound(784, 0.2, "sine"), 200);
    },
    wrong: () => {
      playSound(200, 0.3, "sawtooth");
    },
    success: () => {
      playSound(523, 0.15, "sine", 0.4);
      setTimeout(() => playSound(659, 0.15, "sine", 0.4), 150);
      setTimeout(() => playSound(784, 0.15, "sine", 0.4), 300);
      setTimeout(() => playSound(1047, 0.3, "sine", 0.4), 450);
    },
    tick: () => playSound(1000, 0.05, "square", 0.2),
    type: () => playSound(600, 0.05, "sine", 0.15),
  };

  return {
    sounds,
    isMuted,
    toggleMute,
    startBackgroundMusic,
    stopBackgroundMusic,
  };
};

export default function MathGridPuzzle() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">(
    "menu"
  );
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [verification, setVerification] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(180);
  const [completedPuzzles, setCompletedPuzzles] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameEndReason, setGameEndReason] = useState<"timeUp" | "completed">(
    "timeUp"
  );
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);


  const {
    sounds,
    isMuted,
    toggleMute,
    startBackgroundMusic,
    stopBackgroundMusic,
  } = useSound();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const currentPuzzle =
    PUZZLES[difficulty][puzzleIndex % PUZZLES[difficulty].length];

  useEffect(() => {
    if (gameState === "playing" && !isMuted) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    return () => {
      stopBackgroundMusic();
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      setUserAnswers({});
      setVerification({});
      setFocusedCell(null);
      setShowSuccess(false);
    }
  }, [gameState, difficulty, puzzleIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 10 && t > 0) sounds.tick();
          return t - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameEndReason("timeUp");
      setGameState("results");
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, sounds]);

  const handleInputChange = (cellId: string, value: string) => {
    // Allow only numbers, minus sign, and empty string
    const sanitized = value.replace(/[^0-9-]/g, "");

    // Prevent multiple minus signs
    if (sanitized.split("-").length > 2) return;

    // Prevent minus sign not at the beginning
    if (sanitized.includes("-") && sanitized.indexOf("-") !== 0) return;

    sounds.type();
    setUserAnswers((prev) => ({ ...prev, [cellId]: sanitized }));

    // Clear verification for this cell when user types
    if (verification[cellId] !== undefined) {
      setVerification((prev) => {
        const newState = { ...prev };
        delete newState[cellId];
        return newState;
      });
    }
  };

  const handleCellClick = (cellId: string) => {
    sounds.click();
    setFocusedCell(cellId);
    setTimeout(() => {
      inputRefs.current[cellId]?.focus();
    }, 0);
  };

  const handleKeyDown = (cellId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      verifySolution();
    }
  };
const verifySolution = () => {
  const newVerification: Record<string, boolean> = {};
  let correctCount = 0;
  let totalBlanks = 0;
  let hasEmptyFields = false;

  currentPuzzle.grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isBlank) {
        totalBlanks++;
        const userAnswer = userAnswers[cell.id];
        
        // Check if field is empty
        if (!userAnswer || userAnswer.trim() === "") {
          hasEmptyFields = true;
          return;
        }
        
        const parsedAnswer = parseInt(userAnswer);
        const isCorrect =
          !isNaN(parsedAnswer) && parsedAnswer === cell.correctAnswer;
        newVerification[cell.id] = isCorrect;
        if (isCorrect) correctCount++;
      }
    });
  });

// Don't allow submission if there are empty fields
if (hasEmptyFields) {
  sounds.wrong();
  setShowEmptyWarning(true);
  setTimeout(() => setShowEmptyWarning(false), 1000);
  return;
}

  setVerification(newVerification);

  if (correctCount === totalBlanks) {
    sounds.success();
    setShowSuccess(true);
    setCompletedPuzzles((c) => c + 1);
    setTimeout(() => {
      if (puzzleIndex + 1 < PUZZLES[difficulty].length) {
        setPuzzleIndex((i) => i + 1);
      } else {
        // Completed all puzzles
        setGameEndReason("completed");
        setGameState("results");
      }
    }, 2000);
  } else {
    // Move to next puzzle even if answers are wrong
    sounds.wrong();
    setTimeout(() => {
      if (puzzleIndex + 1 < PUZZLES[difficulty].length) {
        setPuzzleIndex((i) => i + 1);
      } else {
        setGameEndReason("timeUp");
        setGameState("results");
      }
    }, 1500);
  }
};
  const startGame = (diff: "Easy" | "Medium" | "Hard") => {
    sounds.click();
    setDifficulty(diff);
    setPuzzleIndex(0);
    setCompletedPuzzles(0);
    setTimeLeft(diff === "Easy" ? 10 : diff === "Medium" ? 80 : 120);
    setUserAnswers({});
    setVerification({});
    setFocusedCell(null);
    setShowSuccess(false);
    setGameEndReason("timeUp");
    setIsTransitioning(false);
    setGameState("playing");
  };
  const returnToMenu = () => {
    sounds.click();
    setIsTransitioning(true);

    // Reset all game state
    setUserAnswers({});
    setVerification({});
    setFocusedCell(null);
    setShowSuccess(false);
    setPuzzleIndex(0);
    setCompletedPuzzles(0);
    setGameEndReason("timeUp");

    // Short delay to ensure state is reset before transition
    setTimeout(() => {
      setGameState("menu");
      setIsTransitioning(false);
    }, 50);
  };
  const handleQuitGame = () => {
    sounds.click();
    setShowQuitDialog(true);
  };

  const confirmQuit = () => {
    sounds.click();
    setShowQuitDialog(false);
    returnToMenu();
  };

  return (
    <div className="min-h-screen p-2 md:p-4 flex items-center justify-center bg-gray-200">
      <Card className="w-full max-w-4xl border-4 border-gray-900 bg-white shadow-2xl p-4 md:p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60"
              initial={{ x: Math.random() * 100 + "%", y: -20, opacity: 0 }}
              animate={{
                y: "120%",
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isTransitioning && gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-8"
            >
              <div className="space-y-4">
             
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Math Dash
                </h1>
                <p className="text-base md:text-lg font-medium max-w-xl mx-auto text-gray-700 px-4">
                  Type your answers to complete all equations! Numbers work both
                  horizontally and vertically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                {(["Easy", "Medium", "Hard"] as const).map((level) => (
                  <motion.div
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => startGame(level)}
                      className={cn(
                        "w-full h-24 text-2xl font-black border-4 border-gray-900 shadow-xl",
                        level === "Easy" &&
                          "bg-green-400 hover:bg-green-500 text-gray-900",
                        level === "Medium" &&
                          "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
                        level === "Hard" &&
                          "bg-red-400 hover:bg-red-500 text-gray-900"
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <span>{level}</span>
                        <span className="text-xs font-medium opacity-70">
                          {PUZZLES[level].length} Puzzles
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {!isTransitioning && gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 relative"
            >
  <AnimatePresence>
  {showSuccess && (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="bg-green-500 text-white px-8 py-4 rounded-2xl text-3xl font-black border-4 border-gray-900 shadow-2xl">
        🎉 PERFECT! 🎉
      </div>
    </motion.div>
  )}
  {showEmptyWarning && (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-2xl font-black border-4 border-gray-900 shadow-2xl">
        ⚠️ Please fill all the blanks! ⚠️
      </div>
    </motion.div>
  )}
</AnimatePresence>
              <div className="flex items-center justify-between border-b-4 border-gray-900 pb-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.div
                    animate={timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: timeLeft < 10 ? Infinity : 0,
                    }}
                    className="bg-gray-100 border-2 border-gray-900 p-2 rounded-lg flex items-center gap-1.5 shadow-lg"
                  >
                    <Clock
                      className={cn(
                        "w-4 h-4",
                        timeLeft < 30 ? "text-red-600" : "text-blue-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-lg font-black",
                        timeLeft < 30 && "text-red-600"
                      )}
                    >
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Level
                    </span>
                    <span className="text-base font-black">{difficulty}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Puzzle
                    </span>
                    <span className="text-base font-black">
                      {puzzleIndex + 1}/{PUZZLES[difficulty].length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-600">
                      Solved
                    </div>
                    <motion.div
                      key={completedPuzzles}
                      initial={{ scale: 1.5, color: "#22c55e" }}
                      animate={{ scale: 1, color: "#9333ea" }}
                      className="text-2xl font-black text-purple-600"
                    >
                      {completedPuzzles}
                    </motion.div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      toggleMute();
                      if (!isMuted) sounds.click();
                    }}
                    className="border-2 border-gray-900 w-10 h-10 bg-white hover:bg-gray-100"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleQuitGame}
                    className="border-2 border-gray-900 w-10 h-10 hover:bg-red-100"
                  >
                    <Home className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <AlertDialog
                open={showQuitDialog}
                onOpenChange={setShowQuitDialog}
              >
                <AlertDialogContent className="border-4 border-gray-900 bg-white max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black flex items-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-yellow-500" />
                      Quit Game?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-medium text-gray-700">
                      You are about to quit the game. All your progress will be
                      lost!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => sounds.click()}
                      className="border-2 border-gray-900 text-base font-bold"
                    >
                      ❌ Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmQuit}
                      className="bg-red-500 hover:bg-red-600 border-2 border-gray-900 text-base font-bold"
                    >
                      ✓ Quit Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-gray-900 rounded-2xl p-2 sm:p-4 md:p-6 shadow-inner">
                <div className="flex flex-col items-center justify-center">
                  {currentPuzzle.grid.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2"
                    >
                      {row.map((cell, j) => {
                        if (
                          typeof cell.value === "string" &&
                          cell.value !== ""
                        ) {
                          return (
                            <div
                              key={j}
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 flex items-center justify-center text-base sm:text-lg md:text-2xl font-black"
                            >
                              {cell.value}
                            </div>
                          );
                        }

                        if (cell.value === "") {
                          return (
                            <div
                              key={j}
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"
                            />
                          );
                        }

                        if (cell.isBlank) {
                          const isCorrect = verification[cell.id];
                          const hasValue = userAnswers[cell.id]?.length > 0;
                          return (
                            <motion.div
                              key={j}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleCellClick(cell.id)}
                              className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 sm:border-4 flex items-center justify-center text-sm sm:text-base md:text-xl font-black transition-all relative shadow-lg cursor-pointer",
                                focusedCell === cell.id
                                  ? "bg-yellow-300 border-yellow-600 scale-110 shadow-2xl"
                                  : hasValue
                                  ? "bg-blue-200 border-blue-600"
                                  : "bg-white border-gray-500 border-dashed hover:bg-gray-50",
                                isCorrect === true &&
                                  "border-green-600 bg-green-200",
                                isCorrect === false &&
                                  "border-red-600 bg-red-200"
                              )}
                            >
                              <input
                                ref={(el) => {
                                  inputRefs.current[cell.id] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                value={userAnswers[cell.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(cell.id, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(cell.id, e)}
                                onFocus={() => setFocusedCell(cell.id)}
                                onBlur={() => setFocusedCell(null)}
                                className="w-full h-full bg-transparent text-center font-black outline-none"
                                placeholder="?"
                                maxLength={4}
                              />
                              {isCorrect === true && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 pointer-events-none"
                                >
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 bg-white rounded-full" />
                                </motion.div>
                              )}
                              {isCorrect === false && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{
                                    scale: 1,
                                    rotate: [0, -10, 10, -10, 0],
                                  }}
                                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 pointer-events-none"
                                >
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600 bg-white rounded-full" />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        }

                        return (
                          <div
                            key={j}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-900 rounded-xl flex items-center justify-center text-sm sm:text-base md:text-xl font-black shadow-md"
                          >
                            {cell.value}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={verifySolution}
                    className="h-14 px-10 text-xl font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-4 border-gray-900 shadow-2xl"
                  >
                    ✓ Check Solution
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {!isTransitioning && gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-12"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
              </motion.div>
              <div className="space-y-3">
                {gameEndReason === "completed" ? (
                  <>
                    <h2 className="text-4xl font-black text-green-600">
                      🎉 Congratulations! 🎉
                    </h2>
                    <p className="text-2xl font-bold">
                      You completed all{" "}
                      <span className="text-purple-600">
                        {completedPuzzles}
                      </span>{" "}
                      puzzles in {difficulty} mode!
                    </p>
                    <p className="text-lg text-gray-600">
                      Time remaining:{" "}
                      <span className="font-black">
                        {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-orange-600">
                      ⏰ Time's Up! ⏰
                    </h2>
                    <p className="text-2xl font-bold">
                      You completed{" "}
                      <span className="text-green-600">{completedPuzzles}</span>{" "}
                      out of {PUZZLES[difficulty].length} puzzles!
                    </p>
                    {completedPuzzles > 0 && (
                      <p className="text-lg text-gray-600">
                        Great effort! Keep practicing to improve your time.
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={returnToMenu}
                    className="h-14 px-8 text-lg font-bold border-4 border-gray-900 shadow-xl bg-blue-500 hover:bg-gray-100"
                  >
                    🏠 Main Menu
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => startGame(difficulty)}
                    className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-4 border-gray-900 shadow-xl"
                  >
                    🔄 Play Again
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
