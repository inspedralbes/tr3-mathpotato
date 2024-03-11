<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $sqlFilePath = storage_path('app/preguntas.sql');

        if (File::exists($sqlFilePath)) {
            try {
                $sqlContent = File::get($sqlFilePath);
                DB::unprepared($sqlContent);
                $this->command->info('Datos insertados correctamente.');
            } catch (\Exception $e) {
                $this->command->error('Error al ejecutar el archivo SQL: ' . $e->getMessage());
            }
        } else {
            $this->command->error("Archivo SQL no encontrado: $sqlFilePath");
        }
    }
}
