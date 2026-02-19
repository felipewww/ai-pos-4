<template>
    <main>
        <div class="flex h-screen overflow-hidden">
            <!-- Sidebar Navigation -->
            <aside
                class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div class="p-6 flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span class="material-symbols-outlined">neurology</span>
                    </div>
                    <div>
                        <h1 class="text-sm font-bold leading-none">Audio Risk</h1>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Healthcare Portal</p>
                    </div>
                </div>
                <nav class="flex-1 px-4 space-y-1">
                    <a class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                       href="#">
                        <span class="material-symbols-outlined">dashboard</span>
                        <span class="text-sm">Dashboard</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                       href="#">
                        <span class="material-symbols-outlined">history</span>
                        <span class="text-sm">Patient History</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                       href="#">
                        <span class="material-symbols-outlined">analytics</span>
                        <span class="text-sm">Analytics</span>
                    </a>
                    <div class="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">System
                    </div>
                    <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                       href="#">
                        <span class="material-symbols-outlined">settings</span>
                        <span class="text-sm">Settings</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                       href="#">
                        <span class="material-symbols-outlined">help</span>
                        <span class="text-sm">Help Center</span>
                    </a>
                </nav>
                <div class="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div class="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <img alt="Doctor profile" class="w-8 h-8 rounded-full bg-slate-200"
                             data-alt="Profile photo of a male doctor"
                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZD1ttG9FBpbu6uX6vo-A0QPMqeAa34RRmZB6Mr9ZwFTPhJ4jioh0UMqg1vKhnAX3zgkYRNExrstuj4EPcXoAMoeDRtuAUAbanFZwoVADao8ZRGaEJuJMTb2CsOFE-D9v1UE8kLFgVHcBbaW_HmiLUpxzzlaKFsZfmmbFyRU0zzPHbHYjxQp-ejIGk22ZUrhxMtU6Ws3ZigHu-oX6NU2sVssecWvZ6eMYv1Dlb6i8_uSJxOYXteSr4HbKUUTYx6Juw68PmftAxDbM"/>
                        <div class="overflow-hidden">
                            <p class="text-xs font-bold truncate">Dr. Ricardo Silva</p>
                            <p class="text-[10px] text-slate-500 truncate">Clinical Lead</p>
                        </div>
                    </div>
                </div>
            </aside>
            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto flex flex-col">
                <!-- Header -->
                <header
                    class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 class="text-xl font-bold tracking-tight">Clinical Risk Analysis</h2>
                    <div class="flex items-center gap-4">
                        <div class="relative group">
                            <span class="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">notifications</span>
                            <span
                                class="absolute top-0 right-0 w-2 h-2 bg-risk-urgent rounded-full border-2 border-white dark:border-slate-900"></span>
                        </div>
                        <div class="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-2"></div>
                        <button
                            class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            <span class="material-symbols-outlined text-[18px]">add</span>
                            New Assessment
                        </button>
                    </div>
                </header>
                <div class="p-8 max-w-7xl mx-auto w-full space-y-8">
                    <!-- Welcome Section -->
                    <section>
                        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Audio Risk Dashboard</h1>
                        <p class="text-slate-500 dark:text-slate-400 mt-1">Monitor and analyze patient psychological
                            signals through voice processing.</p>
                    </section>
                    <!-- Upload Section -->
                    <section
                        class="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div
                            class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group"
                            @click="triggerFilePicker">
                            <div
                                class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <span class="material-symbols-outlined text-3xl">upload_file</span>
                            </div>
                            <h3 class="text-lg font-bold">Upload Patient Audio</h3>
                            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-2">
                                Drag and drop audio recordings here or click to browse. Supported formats: MP3, WAV (Max
                                25MB).
                            </p>
                            <input
                                ref="fileInput"
                                class="hidden"
                                type="file"
                                accept="audio/*"
                                @change="handleFileChange"
                            />
                            <button
                                class="mt-6 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                type="button"
                                @click.stop="triggerFilePicker"
                                :disabled="isUploading">
                                {{ isUploading ? 'Uploading...' : 'Select File' }}
                            </button>
                            <p v-if="uploadError" class="text-xs text-risk-urgent mt-3">{{ uploadError }}</p>
                        </div>
                    </section>
                    <!-- Table Section -->
                    <section class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold flex items-center gap-2">
                                Processed Audios
                                <span
                                    class="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full">{{ data.length }} total</span>
                            </h3>
                            <div class="flex items-center gap-2">
                                <div class="relative">
                                    <span
                                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                    <input
                                        class="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary w-64"
                                        placeholder="Search patient..." type="text"/>
                                </div>
                                <button
                                    class="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <span class="material-symbols-outlined text-slate-500">filter_list</span>
                                </button>
                            </div>
                        </div>
                        <div
                            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Patient ID / Audio
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk
                                        Level
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                                        Confidence
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Top
                                        Signals
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Human Review
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr v-for="item in data" :key="item.id"
                                    class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-400">
                                                <span class="material-symbols-outlined text-[20px]">mic</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold">{{ item.id }}</p>
                                                <p class="text-[10px] text-slate-400">{{ item.filename }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide"
                                            :class="riskBadgeClass(item.risk?.riskLevel)">
                                            {{ item.risk?.riskLevel ?? item.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-col items-center">
                                            <span class="text-sm font-bold">{{ formatPercent(item.risk?.confidence) }}%</span>
                                            <div
                                                class="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                <div class="h-full" :class="riskBarClass(item.risk?.riskLevel)"
                                                     :style="{ width: formatPercent(item.risk?.confidence) + '%' }"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-wrap gap-1.5" v-if="item.risk?.topSignals?.length">
                                            <span
                                                v-for="signal in item.risk.topSignals"
                                                :key="signal.label"
                                                class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                                {{ signal.label }}: {{ signal.score.toFixed(2) }}
                                            </span>
                                        </div>
                                        <span v-else class="text-[10px] text-slate-400">No signals</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-2" :class="humanReviewClass(item.risk?.riskLevel)">
                                            <span class="material-symbols-outlined text-[18px]">{{ humanReviewIcon(item.risk?.riskLevel) }}</span>
                                            <span class="text-xs font-semibold">{{ humanReviewLabel(item.risk?.humanReviewRequired) }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button class="text-primary font-bold text-xs hover:underline">View Analysis
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="!data.length">
                                    <td class="px-6 py-6 text-center text-sm text-slate-400" colspan="6">
                                        No assessments available yet.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div
                                class="bg-slate-50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <p class="text-xs text-slate-500">Showing {{ data.length }} assessments</p>
                                <div class="flex gap-2">
                                    <button
                                        class="p-1 px-2 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900 disabled:opacity-50"
                                        disabled="">Previous
                                    </button>
                                    <button
                                        class="p-1 px-2 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <!-- Stats Grid (Subtle medical focus) -->
                    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p class="text-sm text-slate-500 font-medium">Critical Cases Today</p>
                            <div class="flex items-end justify-between mt-2">
                                <h4 class="text-3xl font-black text-risk-urgent">04</h4>
                                <span class="text-xs font-bold text-risk-urgent bg-risk-urgent/10 px-2 py-1 rounded">+2 since 8am</span>
                            </div>
                        </div>
                        <div
                            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p class="text-sm text-slate-500 font-medium">Analysis Accuracy</p>
                            <div class="flex items-end justify-between mt-2">
                                <h4 class="text-3xl font-black text-primary">89.4%</h4>
                                <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Overall Model</span>
                            </div>
                        </div>
                        <div
                            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p class="text-sm text-slate-500 font-medium">Pending Human Reviews</p>
                            <div class="flex items-end justify-between mt-2">
                                <h4 class="text-3xl font-black">07</h4>
                                <div class="flex -space-x-2">
                                    <img alt="Avatar 1"
                                         class="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
                                         data-alt="Avatar of health professional"
                                         src="https://lh3.googleusercontent.com/aida-public/AB6AXuASGVf0zU-w1a_Cn4aI5Uc-QqEKsLVSXo1j6NvLmQb8rNNIIRfDJLLbYiX956uDhrSPP8Y2CL74KWv4pveRqPde0T5wOoPJ-T89LWO6s0Jt2z7xzyBxyqnI9vZ7vydl0ALi9r-SudSo-JJKV37TS67qtkUs7lYNK_IhAgW5BuZYI7oI1I1UfSxSg9ZfW5o0g27q1f9OWvWmYIqb8FI84uVaH0MfzqQ8g3iGPbi9NQva8bQJ0ZfxiuMkpZBimvC_sv0DXUTbjivJPng"/>
                                    <img alt="Avatar 2"
                                         class="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
                                         data-alt="Avatar of health professional"
                                         src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFRoensHbXBOz7NUeRj4CXEbiKLNox3ofv-d37Xu2Z0gsMw6rTPfxEIOamIDsKbXHYCOOFE0mvtQ858WHHObF4ee_WmLwqPBzDk4Co-mSa6fjh-u5OJNKV-t7X8oO1go3qgfEgiF2CJ_Lgq4zSOWZPzfqeRii25XxrmyINmKviaitgWaBhcb9tBqcXFt6j_sGs1n3_1K3E1B0a7uWz0SRLiQU8Jd0pzQhvH5B1fnSWX7xPpe8yXU3tnxqyCl6O6CIjs12_Fbv2awY"/>
                                    <div
                                        class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold border-2 border-white dark:border-slate-900">
                                        +5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <footer
                    class="mt-auto py-6 px-8 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
                    © 2024 Clinical Audio Intelligence • HIPAA Compliant Infrastructure • v2.4.0-stable
                </footer>
            </main>
        </div>
    </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ApiService} from "@/infra/services/api.service.ts";
import type {ITranscribedModel, Risk} from "@/core/domain/types.ts";

const data = ref<ITranscribedModel[]>([])
const apiService = new ApiService()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref('')

const loadData = () => {
    apiService.all()
        .then((res) => {
            data.value = res.data
        })
        .catch(() => {
            console.error('api error')
        })
}

onMounted(loadData)

const triggerFilePicker = () => {
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
        return
    }
    uploadError.value = ''
    isUploading.value = true
    try {
        await apiService.uploadAudio(file)
        await loadData()
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    } catch (err) {
        uploadError.value = 'Upload failed. Please try again.'
    } finally {
        isUploading.value = false
    }
}

const formatPercent = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return 0
    }
    return Math.round(value * 100)
}

const riskBadgeClass = (level?: Risk['riskLevel']) => {
    switch (level) {
        case 'URGENTE':
            return 'bg-risk-urgent/10 text-risk-urgent border-risk-urgent/20'
        case 'MONITORAR':
            return 'bg-risk-monitor/10 text-risk-monitor border-risk-monitor/20'
        case 'ROTINA':
            return 'bg-risk-routine/10 text-risk-routine border-risk-routine/20'
        default:
            return 'bg-slate-100 text-slate-500 border-slate-200'
    }
}

const riskBarClass = (level?: Risk['riskLevel']) => {
    switch (level) {
        case 'URGENTE':
            return 'bg-risk-urgent'
        case 'MONITORAR':
            return 'bg-risk-monitor'
        case 'ROTINA':
            return 'bg-risk-routine'
        default:
            return 'bg-slate-300'
    }
}

const humanReviewLabel = (required?: boolean) => {
    return required ? 'Required' : 'Optional'
}

const humanReviewIcon = (level?: Risk['riskLevel']) => {
    if (level === 'URGENTE') {
        return 'warning'
    }
    if (level === 'ROTINA') {
        return 'check_circle'
    }
    return 'pending'
}

const humanReviewClass = (level?: Risk['riskLevel']) => {
    if (level === 'URGENTE') {
        return 'text-risk-urgent'
    }
    if (level === 'ROTINA') {
        return 'text-risk-routine'
    }
    return 'text-slate-400'
}
</script>
