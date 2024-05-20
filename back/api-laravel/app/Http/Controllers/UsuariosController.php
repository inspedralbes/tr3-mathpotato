<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;

class usuariosController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = $request->validate([
                'username' => 'required|string|max:50',
                'email' => 'required|string|email|unique:usuarios',
                'password' => 'required|string|min:6|confirmed',
                'foto_perfil' => [
                    'required',
                    Rule::in(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
                ],
            ]);

            if ($validator) {
                $usuario = new Usuarios();
                $usuario->username = $request->username;
                $usuario->email = $request->email;
                $usuario->password = Hash::make($request->password);
                $usuario->foto_perfil = $request->foto_perfil;

                $usuario->save();

                $token = $usuario->createToken('myapptoken')->plainTextToken;
                return response()->json([
                    'status' => 1,
                    'message' => 'usuari creat correctament',
                    'token' => $token,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'error al crear usuari'
            ]);
        }
    }



    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
            
        ]);

        // Cambia la línea siguiente para asignar el resultado de la consulta a $usuario
        $usuario = Usuarios::where("email", "=", $request->email)->first();

        if ($usuario) {
            if (Hash::check($request->password, $usuario->password)) {
                // dd([
                //     'password' => $request->password,
                //     'hashed_password' => Hash::make($request->password),
                //     'stored_password' => $usuario->password
                // ]);
                $token = $usuario->createToken('myapptoken')->plainTextToken;

                return response()->json([
                    'status' => 1,
                    'username' => $usuario->username,
                    'email' => $usuario->email,
                    'foto_perfil' => $usuario->foto_perfil,
                    'tutorial' => $usuario->tutorial,
                    'message' => 'Usuario logeado correctamente',
                    'token' => $token,
                    'wins' => $usuario->num_victorias,
                    'losses' => $usuario->num_derrotas,
                    'consecutiveVictories' => $usuario->victorias_seguidas,
                ]);
            } else {
                return response()->json([

                    'status' => 0,
                    'message' => 'Contrasenya incorrecta'
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'message' => 'usuario no registrat'
            ]);
        }
    }
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'status' => 1,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
    public function changeProfile(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'username' => 'required|string|max:50',
            'foto_perfil' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'alvaro', 'Ermengol', 'Poltata']),
            ],
        ]);


        $usuario = Usuarios::where("email", "=", $request->email)->first();
        $usuario->username = $request->username;
        if (($request->foto_perfil == 'alvaro' && $usuario->se_llama_alvaro == true) || ($request->foto_perfil == 'Ermengol' && $usuario->se_llama_ermengol == true) || ($request->foto_perfil == 'Poltata' && $usuario->se_llama_pol == true) || ($request->foto_perfil == '10' && $usuario->has_ganado_15_partidas == true) || ($request->foto_perfil == '11' && $usuario->has_ganado_3_partidas_seguidas == true) || ($request->foto_perfil == '12' && $usuario->has_jugado_20_partidas == true) || (intval($request->foto_perfil) >= 1 && intval($request->foto_perfil) <= 9)) {
            $usuario->foto_perfil = $request->foto_perfil;
        }

        $usuario->save();

        return response()->json([
            'status' => 1,
            'username' => $usuario->username,
            'foto_perfil' => $usuario->foto_perfil,


        ]);
    }

    public function checkAchivements(string $email){

        $usuario = Usuarios::where("email", "=", $email)->first();

        return response()->json([
            'image10Unlocked' => $usuario->has_ganado_15_partidas,
            'image11Unlocked' => $usuario->has_ganado_3_partidas_seguidas,
            'image12Unlocked' => $usuario->has_jugado_20_partidas,
        ]);
    }

    public function ranking()
    {
        $usuarios = Usuarios::orderBy('num_victorias', 'desc')->limit(20)->get();

        foreach ($usuarios as $usuario) {
            $totalGames = $usuario->num_victorias + $usuario->num_derrotas;
            $usuario->victory_percentage = $totalGames > 0 ? ($usuario->num_victorias / $totalGames) * 100 : 0;
        }

        // Sort by victory percentage
        $usuarios = $usuarios->sortByDesc('victory_percentage');

        return response()->json([
            'ranking' => $usuarios->values() // Reset keys after sorting
        ]);
    }

    public function updateDerrotas(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $usuario = Usuarios::where("email", "=", $request->email)->first();
        if ($usuario->tutorial == 1) {
            $usuario->tutorial = 0;
        }
        $usuario->victorias_seguidas = 0;
        $usuario->num_derrotas = $usuario->num_derrotas + 1;
        if ($usuario->num_victorias + $usuario->num_derrotas == 20) {
            $usuario->has_jugado_20_partidas = true;
        }
        $usuario->save();
        return response()->json([
            'status' => 1,
            'losses' => $usuario->num_derrotas,
            'consecutiveVictories' => '0',
            'wins' => $usuario->num_victorias
        ]);
    }

    public function updateVictorias(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);
        $usuario = Usuarios::where("email", "=", $request->email)->first();
        if ($usuario->tutorial == 1) {
            $usuario->tutorial = 0;
        }
        $usuario->victorias_seguidas = $usuario->victorias_seguidas + 1;
        $usuario->num_victorias = $usuario->num_victorias + 1;

        if ($usuario->victorias_seguidas == 3) {
            $usuario->has_ganado_3_partidas_seguidas = true;
        }
        if ($usuario->num_victorias == 15) {
            $usuario->has_ganado_15_partidas = true;
        }
        if ($usuario->num_victorias + $usuario->num_derrotas == 20) {
            $usuario->has_jugado_20_partidas = true;
        }
        $usuario->save();
        return response()->json([
            'status' => 1,
            'wins' => $usuario->num_victorias,
            'consecutiveVictories' => $usuario->victorias_seguidas,
            'losses' => $usuario->num_derrotas
        ]);
    }
}
