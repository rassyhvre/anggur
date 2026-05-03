import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
import '../providers/auth_provider.dart';
import '../providers/deteksi_provider.dart';
import '../config/constants.dart';

class ProfilScreen extends StatefulWidget {
  const ProfilScreen({super.key});

  @override
  State<ProfilScreen> createState() => _ProfilScreenState();
}

class _ProfilScreenState extends State<ProfilScreen> {
  bool _uploadingPhoto = false;
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    // Muat stats dari database via provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DeteksiProvider>().loadStats();
    });
  }

  void _viewProfilePhoto(String photoUrl) {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        barrierColor: Colors.black87,
        barrierDismissible: true,
        pageBuilder: (context, animation, secondaryAnimation) {
          return _FullscreenPhotoViewer(
            photoUrl: photoUrl,
            userName: context.read<AuthProvider>().user?.nama ?? 'User',
          );
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 300),
        reverseTransitionDuration: const Duration(milliseconds: 250),
      ),
    );
  }

  void _onAvatarTap() {
    final user = context.read<AuthProvider>().user;
    final hasPhoto = user?.fotoProfil != null && user!.fotoProfil!.isNotEmpty;
    if (hasPhoto) {
      _viewProfilePhoto('${AppConstants.uploadsUrl}/${user!.fotoProfil}');
    } else {
      _pickAndUploadPhoto();
    }
  }

  Future<void> _pickAndUploadPhoto() async {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40, height: 4,
                decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
              ),
              const SizedBox(height: 20),
              const Text('Ganti Foto Profil', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _buildPhotoOption(
                      icon: Icons.camera_alt_rounded,
                      label: 'Kamera',
                      color: const Color(0xFF0284C7),
                      onTap: () {
                        Navigator.pop(context);
                        _uploadFrom(ImageSource.camera);
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildPhotoOption(
                      icon: Icons.photo_library_rounded,
                      label: 'Galeri',
                      color: const Color(0xFF10B981),
                      onTap: () {
                        Navigator.pop(context);
                        _uploadFrom(ImageSource.gallery);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoOption({required IconData icon, required String label, required Color color, required VoidCallback onTap}) {
    return Material(
      color: color.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24),
          child: Column(
            children: [
              Icon(icon, color: color, size: 36),
              const SizedBox(height: 8),
              Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 15)),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _uploadFrom(ImageSource source) async {
    try {
      final photo = await _imagePicker.pickImage(
        source: source, imageQuality: 90, maxWidth: 1200, maxHeight: 1200,
      );
      if (photo == null) return;

      // Crop image dengan rasio 1:1
      final croppedFile = await ImageCropper().cropImage(
        sourcePath: photo.path,
        aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1),
        compressQuality: 85,
        maxWidth: 800,
        maxHeight: 800,
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: 'Crop Foto Profil',
            toolbarColor: const Color(0xFF0284C7),
            toolbarWidgetColor: Colors.white,
            activeControlsWidgetColor: const Color(0xFF0284C7),
            statusBarLight: true,
            backgroundColor: Colors.black,
            dimmedLayerColor: Colors.black54,
            cropFrameColor: Colors.white,
            cropGridColor: Colors.white38,
            cropFrameStrokeWidth: 3,
            cropGridStrokeWidth: 1,
            cropGridRowCount: 2,
            cropGridColumnCount: 2,
            lockAspectRatio: true,
            hideBottomControls: false,
            initAspectRatio: CropAspectRatioPreset.square,
          ),
          IOSUiSettings(
            title: 'Crop Foto Profil',
            aspectRatioLockEnabled: true,
            resetAspectRatioEnabled: false,
            aspectRatioPickerButtonHidden: true,
            rotateButtonsHidden: false,
            rotateClockwiseButtonHidden: true,
          ),
        ],
      );

      if (croppedFile == null) return; // User batal crop

      if (!mounted) return;
      setState(() => _uploadingPhoto = true);

      final croppedXFile = XFile(croppedFile.path);
      final error = await context.read<AuthProvider>().updateProfilePhoto(croppedXFile);

      if (mounted) {
        setState(() => _uploadingPhoto = false);
        if (error != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('✅ Foto profil berhasil diperbarui!'),
              backgroundColor: const Color(0xFF10B981),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _uploadingPhoto = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final hasPhoto = user?.fotoProfil != null && user!.fotoProfil!.isNotEmpty;
    final photoUrl = hasPhoto ? '${AppConstants.uploadsUrl}/${user!.fotoProfil}' : null;

    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // ===== Profile Header =====
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 36, 24, 40),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                ),
              ),
              child: Column(
                children: [
                  // Avatar with camera button
                  GestureDetector(
                    onTap: _uploadingPhoto ? null : _onAvatarTap,
                    child: Hero(
                      tag: 'profile_photo',
                      child: Stack(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 3),
                            ),
                            child: _uploadingPhoto
                                ? const CircleAvatar(
                                    radius: 52,
                                    backgroundColor: Colors.white24,
                                    child: SizedBox(
                                      width: 36, height: 36,
                                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                                    ),
                                  )
                                : CircleAvatar(
                                    radius: 52,
                                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                                    backgroundImage: photoUrl != null ? NetworkImage(photoUrl) : null,
                                    child: photoUrl == null
                                        ? Text(
                                            (user?.nama ?? 'G').substring(0, 1).toUpperCase(),
                                            style: const TextStyle(fontSize: 44, fontWeight: FontWeight.bold, color: Colors.white),
                                          )
                                        : null,
                                  ),
                          ),
                          // Camera button overlay
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: GestureDetector(
                              onTap: _uploadingPhoto ? null : _pickAndUploadPhoto,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 2.5),
                                  boxShadow: [
                                    BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 8, offset: const Offset(0, 2)),
                                  ],
                                ),
                                child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 18),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user?.nama ?? 'Guest',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.email_outlined, size: 16, color: Colors.white70),
                        const SizedBox(width: 6),
                        Text(
                          user?.email ?? '-',
                          style: const TextStyle(fontSize: 14, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ===== Stats Row =====
            Transform.translate(
              offset: const Offset(0, -24),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 6)),
                    ],
                  ),
                  child: Consumer<DeteksiProvider>(
                    builder: (context, deteksi, _) {
                      if (deteksi.statsLoading) {
                        return const Center(child: Padding(
                          padding: EdgeInsets.all(8),
                          child: SizedBox(
                            width: 24, height: 24,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0284C7)),
                          ),
                        ));
                      }
                      return Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _StatItem(icon: Icons.document_scanner_rounded, value: '${deteksi.totalScan}', label: 'Total Scan'),
                          _StatItem(icon: Icons.check_circle_outline_rounded, value: '${deteksi.sehat}', label: 'Sehat'),
                          _StatItem(icon: Icons.warning_amber_rounded, value: '${deteksi.terinfeksi}', label: 'Terinfeksi'),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),

            // ===== Menu List =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  children: [
                    _buildMenuItem(
                      icon: Icons.visibility_rounded,
                      iconColor: const Color(0xFF6366F1),
                      title: 'Lihat Foto Profil',
                      subtitle: 'Tampilkan foto dalam layar penuh',
                      onTap: () {
                        final user = context.read<AuthProvider>().user;
                        final hasPhoto = user?.fotoProfil != null && user!.fotoProfil!.isNotEmpty;
                        if (hasPhoto) {
                          _viewProfilePhoto('${AppConstants.uploadsUrl}/${user!.fotoProfil}');
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: const Text('Belum ada foto profil. Silakan upload terlebih dahulu.'),
                              backgroundColor: const Color(0xFFF59E0B),
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          );
                        }
                      },
                    ),
                    const Divider(height: 1, indent: 60),
                    _buildMenuItem(
                      icon: Icons.camera_alt_rounded,
                      iconColor: const Color(0xFF10B981),
                      title: 'Ganti Foto Profil',
                      subtitle: 'Ambil dari kamera atau galeri',
                      onTap: _pickAndUploadPhoto,
                    ),
                    const Divider(height: 1, indent: 60),
                    _buildMenuItem(
                      icon: Icons.refresh_rounded,
                      iconColor: const Color(0xFF0284C7),
                      title: 'Perbarui Statistik',
                      subtitle: 'Muat ulang data dari server',
                      onTap: () {
                        context.read<DeteksiProvider>().loadStats();
                      },
                    ),
                    const Divider(height: 1, indent: 60),
                    _buildMenuItem(
                      icon: Icons.info_outline_rounded,
                      iconColor: const Color(0xFF7C3AED),
                      title: 'Tentang Aplikasi',
                      subtitle: 'rassyhvre v1.1.0',
                      onTap: () => _showComingSoon(context),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // ===== Logout Button =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: const Row(
                          children: [
                            Icon(Icons.logout_rounded, color: Colors.red),
                            SizedBox(width: 10),
                            Text('Keluar Akun'),
                          ],
                        ),
                        content: const Text('Apakah Anda yakin ingin keluar dari akun?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text('Batal', style: TextStyle(color: Colors.grey[600])),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                              context.read<AuthProvider>().logout();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            child: const Text('Ya, Keluar'),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text('Keluar Akun', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: iconColor, size: 22),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      subtitle: Text(subtitle, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
      trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
      onTap: onTap,
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🚧 Fitur ini segera hadir!'),
        backgroundColor: const Color(0xFF0284C7),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}

// ===== Fullscreen Photo Viewer =====
class _FullscreenPhotoViewer extends StatefulWidget {
  final String photoUrl;
  final String userName;

  const _FullscreenPhotoViewer({
    required this.photoUrl,
    required this.userName,
  });

  @override
  State<_FullscreenPhotoViewer> createState() => _FullscreenPhotoViewerState();
}

class _FullscreenPhotoViewerState extends State<_FullscreenPhotoViewer> {
  final TransformationController _transformController = TransformationController();
  double _dragOffset = 0;
  bool _isDragging = false;

  @override
  void dispose() {
    _transformController.dispose();
    super.dispose();
  }

  void _handleVerticalDragUpdate(DragUpdateDetails details) {
    setState(() {
      _isDragging = true;
      _dragOffset += details.delta.dy;
    });
  }

  void _handleVerticalDragEnd(DragEndDetails details) {
    if (_dragOffset.abs() > 100) {
      Navigator.of(context).pop();
    } else {
      setState(() {
        _dragOffset = 0;
        _isDragging = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final opacity = (1 - (_dragOffset.abs() / 300)).clamp(0.4, 1.0);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
            fit: StackFit.expand,
            children: [
              // Background
              GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: AnimatedOpacity(
                  opacity: _isDragging ? opacity : 1.0,
                  duration: const Duration(milliseconds: 100),
                  child: Container(color: Colors.black.withValues(alpha: 0.92)),
                ),
              ),

              // Photo
              Transform.translate(
                offset: Offset(0, _dragOffset),
                child: GestureDetector(
                  onVerticalDragUpdate: _handleVerticalDragUpdate,
                  onVerticalDragEnd: _handleVerticalDragEnd,
                  child: Center(
                    child: Hero(
                      tag: 'profile_photo',
                      child: InteractiveViewer(
                        transformationController: _transformController,
                        minScale: 0.5,
                        maxScale: 4.0,
                        child: Container(
                          margin: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.4),
                                blurRadius: 30,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Image.network(
                              widget.photoUrl,
                              fit: BoxFit.contain,
                              loadingBuilder: (context, child, loadingProgress) {
                                if (loadingProgress == null) return child;
                                return SizedBox(
                                  width: 300,
                                  height: 300,
                                  child: Center(
                                    child: CircularProgressIndicator(
                                      value: loadingProgress.expectedTotalBytes != null
                                          ? loadingProgress.cumulativeBytesLoaded /
                                              loadingProgress.expectedTotalBytes!
                                          : null,
                                      color: Colors.white,
                                      strokeWidth: 3,
                                    ),
                                  ),
                                );
                              },
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  width: 300,
                                  height: 300,
                                  color: Colors.grey[900],
                                  child: const Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.broken_image_rounded, color: Colors.white54, size: 64),
                                      SizedBox(height: 16),
                                      Text(
                                        'Gagal memuat foto',
                                        style: TextStyle(color: Colors.white54, fontSize: 16),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              // Top bar with name and close button
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: SafeArea(
                  child: AnimatedOpacity(
                    opacity: _isDragging ? opacity : 1.0,
                    duration: const Duration(milliseconds: 100),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.6),
                            Colors.transparent,
                          ],
                        ),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () => Navigator.of(context).pop(),
                            icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.userName,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 17,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Text(
                                  'Foto Profil',
                                  style: TextStyle(
                                    color: Colors.white60,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Bottom hint
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: SafeArea(
                  child: AnimatedOpacity(
                    opacity: _isDragging ? 0.0 : 1.0,
                    duration: const Duration(milliseconds: 200),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      alignment: Alignment.center,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.swipe_vertical_rounded, color: Colors.white54, size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Geser ke bawah untuk menutup',
                              style: TextStyle(color: Colors.white54, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatItem({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF0284C7), size: 24),
        const SizedBox(height: 6),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Color(0xFF1E293B))),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
      ],
    );
  }
}
